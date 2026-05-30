package links

import (
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
