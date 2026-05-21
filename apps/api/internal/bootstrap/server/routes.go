package bootstrap

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/vivek6201/lynq/api/internal/auth"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/database"
)

func SetupRoutes(app *fiber.App) {
	cfg := config.LoadConfig()

	db, err := database.ConnectDB(cfg.DB_URL)
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)

	v1 := app.Group("/api/v1")
	authRoutes := v1.Group("/auth")
	{
		authRoutes.Post("/register", authHandler.RegisterHandler)
		authRoutes.Post("/login", authHandler.LoginHandler)
		authRoutes.Post("/refresh", authHandler.RefreshHandler)
	}

	userRoutes := v1.Group("/user")
	{

	}

	linkRoutes := v1.Group("/links")
	{
		// POST, GET, DELETE with auth middleware

	}

	analyticsRoutes := v1.Group("/analytics")
	{
		// GET with auth middleware

	}

}
