package auth

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/models"
	"github.com/vivek6201/lynq/api/internal/users"
	"github.com/vivek6201/lynq/api/internal/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

type VerificationResult struct {
	Registered bool
	SessionID  string
	UserID     uuid.UUID
	ExpiresAt  time.Time
	TempUserID uuid.UUID
}

type GoogleAuthResult struct {
	Registered bool
	SessionID  string
	UserID     uuid.UUID
	ExpiresAt  time.Time
	TempUserID uuid.UUID
}

type SessionResult struct {
	SessionID string
	UserID    uuid.UUID
	ExpiresAt time.Time
}

type AuthService struct {
	repo         *AuthRepository
	usersService *users.UserService
	emailSender  utils.EmailSender
	oauthConfig  *oauth2.Config
}

func NewService(repo *AuthRepository, usersService *users.UserService, emailSender utils.EmailSender, cfg *config.ConfigVar) *AuthService {
	return &AuthService{
		repo:         repo,
		usersService: usersService,
		emailSender:  emailSender,
		oauthConfig: &oauth2.Config{
			ClientID:     cfg.GOOGLE_CLIENT_ID,
			ClientSecret: cfg.GOOGLE_CLIENT_SECRET,
			RedirectURL:  cfg.GOOGLE_REDIRECT_URL,
			Endpoint:     google.Endpoint,
			Scopes: []string{
				"openid",
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			},
		},
	}
}

func (s *AuthService) SendOTP(email string) error {
	// Validate email format
	email = strings.TrimSpace(strings.ToLower(email))
	if !isValidEmail(email) {
		return errors.New("invalid email address format")
	}

	// Generate a 6-digit OTP
	otp, err := generateOTPCode()
	if err != nil {
		return fmt.Errorf("failed to generate OTP: %w", err)
	}

	// Store OTP in Redis for 5 minutes
	err = s.repo.StoreOTP(email, otp, 5*time.Minute)
	if err != nil {
		return fmt.Errorf("failed to store OTP: %w", err)
	}

	// Send OTP via email helper
	err = s.emailSender.SendOTP(email, otp)
	if err != nil {
		return fmt.Errorf("failed to send OTP email: %w", err)
	}

	return nil
}

func (s *AuthService) VerifyOTP(email string, otp string, ip string, ua string) (*VerificationResult, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	otp = strings.TrimSpace(otp)

	if email == "" || otp == "" {
		return nil, errors.New("email and OTP are required")
	}

	// Verify the OTP code
	ok, err := s.repo.VerifyOTP(email, otp)
	if err != nil {
		return nil, fmt.Errorf("failed to verify OTP: %w", err)
	}
	if !ok {
		return nil, errors.New("invalid or expired OTP code")
	}

	// OTP verified! Check if user exists in the permanent table
	user, err := s.usersService.FindUserByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// User does NOT exist -> Signup path: Create/update TempUser
			var tempUser *models.TempUser
			t, dbErr := s.usersService.GetTempUserByEmail(email)
			if dbErr == nil {
				// Update existing TempUser to set IsExpired = false
				t.IsExpired = false
				t.Provider = "email_otp"
				if err := s.usersService.UpdateTempUser(t); err != nil {
					return nil, fmt.Errorf("failed to update temporary signup session: %w", err)
				}
				tempUser = t
			} else if errors.Is(dbErr, gorm.ErrRecordNotFound) {
				// Create new TempUser
				newTemp := models.TempUser{
					ID:        uuid.New(),
					Email:     email,
					Provider:  "email_otp",
					IsExpired: false,
				}
				if err := s.usersService.CreateTempUser(&newTemp); err != nil {
					return nil, fmt.Errorf("failed to create temporary signup session: %w", err)
				}
				tempUser = &newTemp
			} else {
				return nil, dbErr
			}

			return &VerificationResult{
				Registered: false,
				TempUserID: tempUser.ID,
			}, nil
		}
		return nil, err
	}

	// User exists -> Login path: Create GORM session (valid for 1 day)
	sessionID, err := generateRandomSessionToken()
	if err != nil {
		return nil, err
	}

	expiresAt := time.Now().Add(24 * time.Hour)
	session := models.Session{
		ID:            sessionID,
		UserID:        user.ID,
		Provider:      "email_otp",
		IPAddress:     ip,
		UserAgent:     ua,
		ExpiresAt:     expiresAt,
		LastRotatedAt: time.Now(),
	}

	if err := s.repo.CreateSession(&session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return &VerificationResult{
		Registered: true,
		SessionID:  sessionID,
		UserID:     user.ID,
		ExpiresAt:  expiresAt,
	}, nil
}

func (s *AuthService) GetGoogleAuthURL(state string) string {
	return s.oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func (s *AuthService) GoogleCallback(code string, ip string, ua string) (*GoogleAuthResult, error) {
	// Exchange authorization code for token
	token, err := s.oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("oauth code exchange failed: %w", err)
	}

	// Fetch user details from Google UserInfo endpoint
	userInfo, err := fetchGoogleUserProfile(token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch google user profile: %w", err)
	}

	email := strings.ToLower(userInfo.Email)
	if email == "" {
		return nil, errors.New("google account has no email address associated")
	}

	// Check if user is already registered in DB
	user, err := s.usersService.FindUserByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// User does NOT exist -> Signup path: Create/update TempUser
			var tempUser *models.TempUser
			t, existingTemp := s.usersService.GetTempUserByEmail(email)
			if existingTemp == nil {
				// Update existing TempUser
				t.IsExpired = false
				t.DisplayName = userInfo.Name
				t.AvatarURL = userInfo.Picture
				t.Provider = "google"
				if err := s.usersService.UpdateTempUser(t); err != nil {
					return nil, fmt.Errorf("failed to update temporary signup session: %w", err)
				}
				tempUser = t
			} else if errors.Is(existingTemp, gorm.ErrRecordNotFound) {
				// Create new TempUser
				newTemp := models.TempUser{
					ID:          uuid.New(),
					Email:       email,
					DisplayName: userInfo.Name,
					AvatarURL:   userInfo.Picture,
					Provider:    "google",
					IsExpired:   false,
				}
				if err := s.usersService.CreateTempUser(&newTemp); err != nil {
					return nil, fmt.Errorf("failed to create temporary signup session: %w", err)
				}
				tempUser = &newTemp
			} else {
				return nil, existingTemp
			}

			return &GoogleAuthResult{
				Registered: false,
				TempUserID: tempUser.ID,
			}, nil
		}
		return nil, err
	}

	// User exists -> Login path: Create GORM session (valid for 30 days)
	sessionID, err := generateRandomSessionToken()
	if err != nil {
		return nil, err
	}

	expiresAt := time.Now().Add(30 * 24 * time.Hour) // 30 Days
	session := models.Session{
		ID:            sessionID,
		UserID:        user.ID,
		Provider:      "google",
		IPAddress:     ip,
		UserAgent:     ua,
		ExpiresAt:     expiresAt,
		LastRotatedAt: time.Now(),
	}

	if err := s.repo.CreateSession(&session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return &GoogleAuthResult{
		Registered: true,
		SessionID:  sessionID,
		UserID:     user.ID,
		ExpiresAt:  expiresAt,
	}, nil
}

func (s *AuthService) CompleteOnboarding(tempUserID uuid.UUID, username string, ip string, ua string) (*SessionResult, error) {
	username = strings.TrimSpace(username)

	// Validate username format (regex: alphanumeric + underscores, 3-30 chars)
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]{3,30}$`)
	if !usernameRegex.MatchString(username) {
		return nil, errors.New("username must be 3-30 characters long and contain only letters, numbers, and underscores")
	}

	// Fetch active TempUser
	tempUser, err := s.usersService.GetTempUserByID(tempUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("onboarding session not found or has expired")
		}
		return nil, err
	}

	// Verify username uniqueness
	_, err = s.usersService.FindUserByUsername(username)
	if err == nil {
		return nil, errors.New("username is already taken")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Generate UUID for the new user
	newUserID := uuid.New()

	user := models.User{
		ID:          newUserID,
		Username:    username,
		Email:       tempUser.Email,
		DisplayName: tempUser.DisplayName,
		AvatarURL:   tempUser.AvatarURL,
	}

	err = s.usersService.CompleteOnboarding(&user, tempUser.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to complete registration: %w", err)
	}

	// Registration complete! Generate active session
	sessionID, err := generateRandomSessionToken()
	if err != nil {
		return nil, err
	}

	// Expiry varies by provider
	var expiresAt time.Time
	if tempUser.Provider == "google" {
		expiresAt = time.Now().Add(30 * 24 * time.Hour) // 30 days
	} else {
		expiresAt = time.Now().Add(24 * time.Hour) // 1 day
	}

	session := models.Session{
		ID:            sessionID,
		UserID:        newUserID,
		Provider:      tempUser.Provider,
		IPAddress:     ip,
		UserAgent:     ua,
		ExpiresAt:     expiresAt,
		LastRotatedAt: time.Now(),
	}

	if err := s.repo.CreateSession(&session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return &SessionResult{
		SessionID: sessionID,
		UserID:    newUserID,
		ExpiresAt: expiresAt,
	}, nil
}

func (s *AuthService) RevokeSession(sessionID string) error {
	if sessionID == "" {
		return errors.New("session ID is required")
	}
	return s.repo.DeleteSession(sessionID)
}
