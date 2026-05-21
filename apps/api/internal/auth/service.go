package auth

import (
	"github.com/gofiber/fiber/v3"
)

type AuthService struct {
	repo *AuthRepository
}

func NewService(repo *AuthRepository) *AuthService {
	return &AuthService{
		repo: repo,
	}
}

func (s *AuthService) Login(c fiber.Ctx) error {
	return c.SendString("Login Service")
}
