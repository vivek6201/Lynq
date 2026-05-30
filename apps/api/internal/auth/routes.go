package auth

import (
	"github.com/gofiber/fiber/v3"
)

// RegisterRoutes attaches the auth endpoints to the provided router group
func RegisterRoutes(router fiber.Router, handler *AuthHandler, authMiddleware fiber.Handler) {
	authRoutes := router.Group("/auth")
	{
		authRoutes.Post("/otp/send", handler.SendOTPHandler)
		authRoutes.Post("/otp/verify", handler.VerifyOTPHandler)
		authRoutes.Get("/google/login", handler.GoogleLoginHandler)
		authRoutes.Get("/google/callback", handler.GoogleCallbackHandler)
		authRoutes.Post("/register/complete", handler.CompleteRegisterHandler)
		authRoutes.Post("/logout", authMiddleware, handler.LogoutHandler)
	}
}
