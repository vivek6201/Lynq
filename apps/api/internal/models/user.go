package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	Username     string `json:"username" gorm:"size:32;uniqueIndex;not null"`
	Email        string `json:"email" gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string `json:"-" gorm:"default:null"`
	DisplayName  string `json:"display_name" gorm:"size:100"`
	Bio          string `json:"bio" gorm:"type:text"`
	AvatarURL    string `json:"avatar_url"`
	Links        []Link `json:"links,omitempty" gorm:"foreignKey:UserID"`

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

type TempUser struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Email       string    `json:"email" gorm:"size:255;uniqueIndex;not null"`
	DisplayName string    `json:"display_name" gorm:"size:100"`
	AvatarURL   string    `json:"avatar_url"`
	Provider    string    `json:"provider" gorm:"size:20;default:'email_otp'"` // "google" or "email_otp"
	IsExpired   bool      `json:"is_expired" gorm:"default:false"`

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
