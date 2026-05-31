package links

import (
	"errors"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/utils"
	"gorm.io/gorm"
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
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid user ID", err)
	}

	links, err := h.service.GetAllUserLinks(id)
	if err != nil {
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to get all user links", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "All user links fetched successfully", links)
}

func (h *LinkHandler) GetLinkByIdHandler(c fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)

	if !ok || userID == "" {
		return utils.SendError(c, fiber.StatusBadRequest, "No user found", nil)
	}

	id, err := uuid.Parse(userID)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid userId", err)
	}

	linkID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid linkId", err)
	}

	link, err := h.service.GetLinkById(linkID, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, fiber.StatusNotFound, "Link not found", err)
		}
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to get link by id", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "Link fetched successfully", link)
}

func (h *LinkHandler) UpdateLinkHandler(c fiber.Ctx) error {
	var linkData UpdateLinkRequest

	if err := c.Bind().JSON(&linkData); err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid request payload", err)
	}

	linkId, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid linkId", err)
	}

	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return utils.SendError(c, fiber.StatusBadRequest, "No userId found", nil)
	}

	id, err := uuid.Parse(userID)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid userId", err)
	}

	link, err := h.service.UpdateLink(linkId, id, linkData)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, fiber.StatusNotFound, "Link not found", err)
		}
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to update link", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "Link updated successfully", link)
}

func (h *LinkHandler) DeleteLinkHandler(c fiber.Ctx) error {
	linkId, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid linkId", err)
	}

	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return utils.SendError(c, fiber.StatusBadRequest, "No userId found", nil)
	}

	id, err := uuid.Parse(userID)
	if err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "Invalid userId", err)
	}

	err = h.service.DeleteLinkByID(linkId, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.SendError(c, fiber.StatusNotFound, "Link not found", err)
		}
		return utils.SendError(c, fiber.StatusInternalServerError, "Failed to delete link", err)
	}

	return utils.SendSuccess(c, fiber.StatusOK, "Link deleted successfully", nil)
}
