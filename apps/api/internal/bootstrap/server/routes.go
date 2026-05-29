package bootstrap

import (
	"github.com/gofiber/fiber/v3"
	"github.com/redis/go-redis/v9"
	"github.com/vivek6201/lynq/api/internal/auth"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/middleware"
	"github.com/vivek6201/lynq/api/internal/users"
	"github.com/vivek6201/lynq/api/internal/utils"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB, rdb *redis.Client, cfg *config.ConfigVar) {
	// Initialize user layers first since auth layer depends on it
	userRepo := users.NewRepository(db, rdb)
	userService := users.NewUserService(userRepo, cfg)
	userHandler := users.NewUserHandler(userService, cfg)

	// Initialize helpers & auth layers
	mockEmail := utils.NewMockEmailSender()
	authRepo := auth.NewRepository(db, rdb)
	authService := auth.NewService(authRepo, userService, mockEmail, cfg)
	authHandler := auth.NewHandler(authService, cfg)

	v1 := app.Group("/api/v1")

	// Register Authentication Endpoints
	authRoutes := v1.Group("/auth")
	{
		authRoutes.Post("/otp/send", authHandler.SendOTPHandler)
		authRoutes.Post("/otp/verify", authHandler.VerifyOTPHandler)
		authRoutes.Get("/google/login", authHandler.GoogleLoginHandler)
		authRoutes.Get("/google/callback", authHandler.GoogleCallbackHandler)
		authRoutes.Post("/register/complete", authHandler.CompleteRegisterHandler)
		authRoutes.Post("/logout", middleware.AuthMiddleware(db), authHandler.LogoutHandler)
	}

	// Register User Endpoints
	userRoutes := v1.Group("/users", middleware.AuthMiddleware(db))
	{
		userRoutes.Get("/me", userHandler.GetUserHandler)
	}

}
