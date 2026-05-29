package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/vivek6201/lynq/api/internal/models"
)

func ConnectDB(DB_URL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(DB_URL), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func MigrateDB(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.Link{},
		&models.TempUser{},
		&models.Session{},
	)
}
