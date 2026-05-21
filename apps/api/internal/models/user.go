package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	Username     string `json:"username" gorm:"size:32;uniqueIndex;not null"`
	Email        string `json:"email" gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string `json:"-" gorm:"not null"`
	DisplayName  string `json:"display_name" gorm:"size:100"`
	Bio          string `json:"bio" gorm:"type:text"`
	AvatarURL    string `json:"avatar_url"`
	IsVerified   bool   `json:"is_verified" gorm:"default:false"`
	Links        []Link `json:"links,omitempty" gorm:"foreignKey:UserID"`

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
