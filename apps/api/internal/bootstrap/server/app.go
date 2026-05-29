package bootstrap

import (
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/database"
	"github.com/vivek6201/lynq/api/internal/middleware"
)

type structValidator struct {
	validate *validator.Validate
}

func (v *structValidator) Validate(out any) error {
	return v.validate.Struct(out)
}

func StartServer() {
	cfg := config.LoadConfig()

	// 1. Connect to PostgreSQL DB
	db, err := database.ConnectDB(cfg.DB_URL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run GORM AutoMigrations
	if err := database.MigrateDB(db); err != nil {
		log.Fatalf("Failed to run database migrations: %v", err)
	}
	log.Println("Database migrated successfully")

	// 2. Connect to Redis
	rdb, err := database.ConnectRedis(cfg.REDIS_URL)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	log.Println("Connected to Redis successfully")

	app := fiber.New(
		fiber.Config{
			AppName:         "Lynq Server",
			StructValidator: &structValidator{validate: validator.New()},
		},
	)

	// Use custom logger middleware
	app.Use(middleware.LoggerMiddleware())

	SetupRoutes(app, db, rdb, cfg)
	log.Printf("Starting server on port %s...", cfg.PORT)
	if err := app.Listen(":" + cfg.PORT); err != nil {
		log.Fatalf("Server failed to listen: %v", err)
	}
}
