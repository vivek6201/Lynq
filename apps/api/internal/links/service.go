package links

import (
	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/models"
)

type LinkService struct {
	repository *LinkRepository
}

func NewLinkService(repository *LinkRepository) *LinkService {
	return &LinkService{
		repository: repository,
	}
}

func (s *LinkService) CreateLink(userID uuid.UUID, req *CreateLinkRequest) (*models.Link, error) {
	link := &models.Link{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		Url:         req.Url,
		IconURL:     req.IconURL,
		Position:    req.Position,
		IsActive:    req.IsActive,
	}

	if err := s.repository.CreateLink(link); err != nil {
		return nil, err
	}

	return link, nil
}
