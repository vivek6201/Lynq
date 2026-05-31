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

func (s *LinkService) GetAllUserLinks(userId uuid.UUID) ([]UserLinkResponse, error) {
	return s.repository.GetAllUserLinks(userId)
}

func (s *LinkService) UpdateLink(linkId uuid.UUID, id uuid.UUID, linkData UpdateLinkRequest) (UserLinkResponse, error) {
	if err := s.repository.UpdateLink(linkId, id, linkData); err != nil {
		return UserLinkResponse{}, err
	}

	return s.GetLinkById(linkId, id)
}

func (s *LinkService) GetLinkById(id uuid.UUID, userId uuid.UUID) (UserLinkResponse, error) {
	userLink, err := s.repository.GetLinkById(id, userId)

	if err != nil {
		return UserLinkResponse{}, err
	}

	return *userLink, nil
}

func (s *LinkService) DeleteLinkByID(id uuid.UUID, userId uuid.UUID) error {
	_, err := s.repository.GetLinkById(id, userId)

	if err != nil {
		return err
	}

	if err := s.repository.DeleteLinkByID(id, userId); err != nil {
		return err
	}

	return nil
}
