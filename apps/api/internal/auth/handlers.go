package auth

import (
	"crypto/rand"
	"encoding/hex"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/utils"
)

type AuthHandler struct {
	service *AuthService
	cfg     *config.ConfigVar
}

func NewHandler(service *AuthService, cfg *config.ConfigVar) *AuthHandler {
	return &AuthHandler{
		service: service,
		cfg:     cfg,
	}
}

type sendOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type verifyOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	OTP   string `json:"otp" validate:"required,len=6"`
}

type completeRegisterRequest struct {
	TempUserID string `json:"temp_user_id" validate:"required,uuid"`
	Username   string `json:"username" validate:"required"`
}

// Send OTP to user's email for login

func (h *AuthHandler) SendOTPHandler(c fiber.Ctx) error {
	var req sendOTPRequest
	if err := c.Bind().JSON(&req); err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid request payload", err)
	}

	err := h.service.SendOTP(req.Email)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Failed to send OTP", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "OTP sent successfully", nil)
}

// Verify OTP and generate session token

func (h *AuthHandler) VerifyOTPHandler(c fiber.Ctx) error {
	var req verifyOTPRequest
	if err := c.Bind().JSON(&req); err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid request payload", err)
	}

	ip := c.IP()
	ua := c.Get("User-Agent")

	result, err := h.service.VerifyOTP(req.Email, req.OTP, ip, ua)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Verification failed", err)
	}

	if !result.Registered {
		return utils.SendSuccess(c, fiber.StatusOK, "Email verified, onboarding pending", fiber.Map{
			"registered":   false,
			"temp_user_id": result.TempUserID,
		})
	}

	sessionToken, err := utils.GenerateJWTToken(result.SessionID, result.UserID.String(), result.ExpiresAt, h.cfg.JWT_SECRET)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to generate session token", err)
	}
	// Set HTTP-only Cookie
	c.Cookie(&fiber.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Path:     "/",
		HTTPOnly: true,
		Secure:   false, // Set to true if deploying over HTTPS
		Expires:  result.ExpiresAt,
	})

	return utils.SendSuccess(c, fiber.StatusOK, "Login successful", fiber.Map{
		"registered":    true,
		"session_token": sessionToken,
		"expires_at":    result.ExpiresAt,
	})
}

// Google Login Handler

func (h *AuthHandler) GoogleLoginHandler(c fiber.Ctx) error {
	// Generate random OAuth state to prevent CSRF
	stateBytes := make([]byte, 16)
	if _, err := rand.Read(stateBytes); err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Internal server error", err)
	}
	state := hex.EncodeToString(stateBytes)

	// Save state in secure short-lived cookie (5 mins)
	c.Cookie(&fiber.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(5 * time.Minute),
	})

	redirectURL := h.service.GetGoogleAuthURL(state)
	return c.Redirect().To(redirectURL)
}

// Google Callback Handler

func (h *AuthHandler) GoogleCallbackHandler(c fiber.Ctx) error {
	state := c.Query("state")
	cookieState := c.Cookies("oauth_state")

	// Validate CSRF state
	if state == "" || state != cookieState {
		return utils.SendError(c, fiber.StatusUnauthorized, "Invalid OAuth state configuration", nil)
	}

	// Delete state cookie
	c.Cookie(&fiber.Cookie{
		Name:     "oauth_state",
		Value:    "",
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	code := c.Query("code")
	if code == "" {
		return utils.SendError(c, fiber.StatusBadRequest, "Google authorization code missing", nil)
	}

	ip := c.IP()
	ua := c.Get("User-Agent")

	result, err := h.service.GoogleCallback(code, ip, ua)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Google authentication failed", err)
	}

	if !result.Registered {
		// New user signup: Redirect to select username on frontend
		redirectURL := h.cfg.FRONTEND_URL + "/auth?temp_user_id=" + result.TempUserID.String() + "&registered=false"
		return c.Redirect().To(redirectURL)
	}

	sessionToken, err := utils.GenerateJWTToken(result.SessionID, result.UserID.String(), result.ExpiresAt, h.cfg.JWT_SECRET)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to generate session token", err)
	}
	// Existing user login: Set Session ID Cookie and redirect to dashboard
	c.Cookie(&fiber.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		Expires:  result.ExpiresAt,
	})

	redirectURL := h.cfg.FRONTEND_URL + "/auth/callback?session_token=" + sessionToken + "&registered=true"
	return c.Redirect().To(redirectURL)

}

// Complete Register Handler

func (h *AuthHandler) CompleteRegisterHandler(c fiber.Ctx) error {
	var req completeRegisterRequest
	if err := c.Bind().JSON(&req); err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid request payload", err)
	}

	tempUserID, err := uuid.Parse(req.TempUserID)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid temp_user_id format", err)
	}

	ip := c.IP()
	ua := c.Get("User-Agent")

	result, err := h.service.CompleteOnboarding(tempUserID, req.Username, ip, ua)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Registration failed", err)
	}

	// Set HTTP-only Cookie
	sessionToken, err := utils.GenerateJWTToken(result.SessionID, result.UserID.String(), result.ExpiresAt, h.cfg.JWT_SECRET)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to generate session token", err)
	}
	c.Cookie(&fiber.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		Expires:  result.ExpiresAt,
	})

	return utils.SendSuccess(c, fiber.StatusOK, "Registration onboarding completed", fiber.Map{
		"session_token": sessionToken,
		"expires_at":    result.ExpiresAt,
	})
}

// Logout Handler

func (h *AuthHandler) LogoutHandler(c fiber.Ctx) error {
	sessionID, ok := c.Locals("sessionID").(string)
	if !ok || sessionID == "" {
		return utils.SendError(c, fiber.StatusUnauthorized, "No active session found", nil)
	}

	err := h.service.RevokeSession(sessionID)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to revoke session", err)
	}

	// Clear Cookie
	c.Cookie(&fiber.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		HTTPOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	return utils.SendSuccess(c, fiber.StatusOK, "Logged out successfully", nil)
}
