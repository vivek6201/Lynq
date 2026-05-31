package links

import (
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/vivek6201/lynq/api/internal/models"
	"gorm.io/gorm"
)

type LinkRepository struct {
	db  *gorm.DB
	rdb *redis.Client
}

func NewLinkRepository(db *gorm.DB, rdb *redis.Client) *LinkRepository {
	return &LinkRepository{
		db:  db,
		rdb: rdb,
	}
}

func (r *LinkRepository) CreateLink(link *models.Link) error {
	return r.db.Create(link).Error
}

func (r *LinkRepository) GetAllUserLinks(userId uuid.UUID) ([]UserLinkResponse, error) {
	var userLinks []UserLinkResponse

	err := r.db.Model(&models.Link{}).Where("user_id = ?", userId).Find(&userLinks).Error

	return userLinks, err
}

func (r *LinkRepository) GetLinkById(id uuid.UUID, userId uuid.UUID) (*UserLinkResponse, error) {
	var userLink UserLinkResponse

	err := r.db.Model(&models.Link{}).Where("id = ? AND user_id = ?", id, userId).First(&userLink).Error

	if err != nil {
		return nil, err
	}

	return &userLink, nil
}

func (r *LinkRepository) UpdateLink(id uuid.UUID, userId uuid.UUID, linkData UpdateLinkRequest) error {
	result := r.db.Model(&models.Link{}).Where("id = ? AND user_id = ?", id, userId).Updates(linkData)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *LinkRepository) DeleteLinkByID(id uuid.UUID, userId uuid.UUID) error {
	var link models.Link
	err := r.db.Where("id = ? AND user_id = ?", id, userId).First(&link).Error
	if err != nil {
		return err
	}

	err = r.db.Delete(&link).Error
	return err
}
