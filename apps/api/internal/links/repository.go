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
