package auth

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{
		db: db,
	}
}

func (r *AuthRepository) Login(c fiber.Ctx) error {
	return c.SendString("Login Repository")
}

func (r *AuthRepository) Register(c fiber.Ctx) error {
	return c.SendString("Register Repository")
}

func (r *AuthRepository) Refresh(c fiber.Ctx) error {
	return c.SendString("Refresh Repository")
}
