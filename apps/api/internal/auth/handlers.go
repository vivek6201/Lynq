package auth

import (
	"github.com/gofiber/fiber/v3"
)

type AuthHandler struct {
	service *AuthService
}

func NewHandler(service *AuthService) *AuthHandler {
	return &AuthHandler{
		service: service,
	}
}

func (h *AuthHandler) LoginHandler(c fiber.Ctx) error {
	return c.SendString("Login Handler")
}

func (h *AuthHandler) RegisterHandler(c fiber.Ctx) error {
	return c.SendString("Register Handler")
}

func (h *AuthHandler) RefreshHandler(c fiber.Ctx) error {
	return c.SendString("Refresh Handler")
}
