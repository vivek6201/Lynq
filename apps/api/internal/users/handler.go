package users

import (
	"errors"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/utils"
	"gorm.io/gorm"
)

type UserHandler struct {
	service *UserService
	cfg     *config.ConfigVar
}

func NewUserHandler(service *UserService, cfg *config.ConfigVar) *UserHandler {
	return &UserHandler{
		service: service,
		cfg:     cfg,
	}
}

func (h *UserHandler) GetUserHandler(c fiber.Ctx) error {
	userIDStr, ok := c.Locals("userID").(string)
	if !ok || userIDStr == "" {
		return utils.SendError(c, fiber.StatusUnauthorized, "Unauthorized access", nil)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid user ID format in session", err)
	}

	user, err := h.service.GetUserByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, fiber.StatusNotFound, "User profile not found", err)
		}
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to fetch user profile", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "User profile retrieved successfully", user)
}
