package bootstrap

import (
	"github.com/gofiber/fiber/v3"
	"github.com/redis/go-redis/v9"
	"github.com/vivek6201/lynq/api/internal/auth"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/links"
	"github.com/hibiken/asynq"
	"github.com/vivek6201/lynq/api/internal/middleware"
	"github.com/vivek6201/lynq/api/internal/users"
	"github.com/vivek6201/lynq/api/internal/worker"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB, rdb *redis.Client, cfg *config.ConfigVar) {
	redisOpt := asynq.RedisClientOpt{Addr: cfg.REDIS_URL}
	taskDistributor := worker.NewRedisTaskDistributor(redisOpt)
	userRepo := users.NewRepository(db, rdb)
	userService := users.NewUserService(userRepo)
	userHandler := users.NewUserHandler(userService, cfg)

	// Initialize helpers & auth layers
	authRepo := auth.NewRepository(db, rdb)
	authService := auth.NewService(authRepo, userService, taskDistributor, cfg)
	authHandler := auth.NewHandler(authService, cfg)

	linkRepo := links.NewLinkRepository(db, rdb)
	linkService := links.NewLinkService(linkRepo)
	linkHandler := links.NewLinkHandler(linkService, cfg)

	authMiddleware := middleware.AuthMiddleware(db, cfg.JWT_SECRET)

	v1 := app.Group("/api/v1")
	{
		auth.RegisterRoutes(v1, authHandler, authMiddleware)
		users.RegisterRoutes(v1, userHandler, authMiddleware)
		links.RegisterRoutes(v1, linkHandler, authMiddleware)
	}
}
