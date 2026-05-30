package links

import (
	"github.com/gofiber/fiber/v3"
)

// RegisterRoutes attaches the link endpoints to the provided router group
func RegisterRoutes(router fiber.Router, handler *LinkHandler, authMiddleware fiber.Handler) {
	linkRoutes := router.Group("/links", authMiddleware)
	{
		linkRoutes.Post("/", handler.CreateLinkHandler)
		linkRoutes.Get("/", handler.GetAllUserLinksHandler)
		linkRoutes.Get("/:id", handler.GetLinkByIdHandler)
		linkRoutes.Put("/:id", handler.UpdateLinkHandler)
		linkRoutes.Delete("/:id", handler.DeleteLinkHandler)
	}
}
