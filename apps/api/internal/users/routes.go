package users

import (
	"github.com/gofiber/fiber/v3"
)

// RegisterRoutes attaches the user endpoints to the provided router group
func RegisterRoutes(router fiber.Router, handler *UserHandler, authMiddleware fiber.Handler) {
	userRoutes := router.Group("/users", authMiddleware)
	{
		userRoutes.Get("/me", handler.GetUserHandler)
	}
}
