package users

import (
	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/models"
)

type UserService struct {
	repo *UserRepository
	cfg  *config.ConfigVar
}

func NewUserService(repo *UserRepository, cfg *config.ConfigVar) *UserService {
	return &UserService{
		repo: repo,
		cfg:  cfg,
	}
}

func (s *UserService) FindUserByEmail(email string) (*models.User, error) {
	return s.repo.FindUserByEmail(email)
}

func (s *UserService) FindUserByUsername(username string) (*models.User, error) {
	return s.repo.FindUserByUsername(username)
}

func (s *UserService) GetUserByID(id uuid.UUID) (*models.User, error) {
	return s.repo.FindUserById(id)
}

func (s *UserService) CreateUser(user *models.User) error {
	return s.repo.CreateUser(user)
}

func (s *UserService) CreateTempUser(tempUser *models.TempUser) error {
	return s.repo.CreateTempUser(tempUser)
}

func (s *UserService) UpdateTempUser(tempUser *models.TempUser) error {
	return s.repo.UpdateTempUser(tempUser)
}

func (s *UserService) GetTempUserByID(id uuid.UUID) (*models.TempUser, error) {
	return s.repo.GetTempUserByID(id)
}

func (s *UserService) GetTempUserByEmail(email string) (*models.TempUser, error) {
	return s.repo.GetTempUserByEmail(email)
}

func (s *UserService) CompleteOnboarding(user *models.User, tempUserID uuid.UUID) error {
	return s.repo.CreateUserFromTempUser(user, tempUserID)
}
