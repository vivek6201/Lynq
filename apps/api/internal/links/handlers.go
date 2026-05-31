package links

import (
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/utils"
)

type LinkHandler struct {
	service *LinkService
	cfg     *config.ConfigVar
}

func NewLinkHandler(service *LinkService, cfg *config.ConfigVar) *LinkHandler {
	return &LinkHandler{
		service: service,
		cfg:     cfg,
	}
}

// Create Link Handler
func (h *LinkHandler) CreateLinkHandler(c fiber.Ctx) error {
	var req CreateLinkRequest
	if err := c.Bind().JSON(&req); err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid request payload", err)
	}

	userIDStr, ok := c.Locals("userID").(string)
	if !ok || userIDStr == "" {
		return utils.SendError(c, fiber.StatusUnauthorized, "Unauthorized access", nil)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return utils.SendError(c, fiber.StatusUnauthorized, "Invalid user ID", err)
	}

	link, err := h.service.CreateLink(userID, &req)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to create link", err)
	}

	return utils.SendSuccess(c, fiber.StatusCreated, "Link created successfully", link)
}

func (h *LinkHandler) GetAllUserLinksHandler(c fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)

	if !ok || userID == "" {
		return utils.SendError(c, fiber.StatusBadRequest, "No userId found", nil)
	}

	id, err := uuid.Parse(userID)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid user ID", nil)
	}

	links, err := h.service.GetAllUserLinks(id)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to get all user links", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "All user links fetched successfully", links)
}

func (h *LinkHandler) GetLinkByIdHandler(c fiber.Ctx) error {
	return utils.SendSuccess(c, fiber.StatusOK, "Not implemented yet", nil)
}

func (h *LinkHandler) UpdateLinkHandler(c fiber.Ctx) error {
	return utils.SendSuccess(c, fiber.StatusOK, "Not implemented yet", nil)
}

func (h *LinkHandler) DeleteLinkHandler(c fiber.Ctx) error {
	return utils.SendSuccess(c, fiber.StatusOK, "Not implemented yet", nil)
}
