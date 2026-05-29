package users

import (
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/vivek6201/lynq/api/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db  *gorm.DB
	rdb *redis.Client
}

func NewRepository(db *gorm.DB, rdb *redis.Client) *UserRepository {
	return &UserRepository{
		db:  db,
		rdb: rdb,
	}
}

func (r *UserRepository) FindUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindUserByUsername(username string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindUserById(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) CreateTempUser(tempUser *models.TempUser) error {
	return r.db.Create(tempUser).Error
}

func (r *UserRepository) UpdateTempUser(tempUser *models.TempUser) error {
	return r.db.Save(tempUser).Error
}

func (r *UserRepository) GetTempUserByID(id uuid.UUID) (*models.TempUser, error) {
	var tempUser models.TempUser
	if err := r.db.Where("id = ? AND is_expired = ?", id, false).First(&tempUser).Error; err != nil {
		return nil, err
	}
	return &tempUser, nil
}

func (r *UserRepository) GetTempUserByEmail(email string) (*models.TempUser, error) {
	var tempUser models.TempUser
	if err := r.db.Where("email = ?", email).First(&tempUser).Error; err != nil {
		return nil, err
	}
	return &tempUser, nil
}

func (r *UserRepository) CreateUserFromTempUser(user *models.User, tempUserID uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		if err := tx.Model(&models.TempUser{}).Where("id = ?", tempUserID).Update("is_expired", true).Error; err != nil {
			return err
		}

		return nil
	})
}

