package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Username     string    `gorm:"size:32;uniqueIndex;not null"`
	Email        string    `gorm:"size:255;uniqueIndex;not null"`
	PasswordHash string    `gorm:"default:null"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type TempUser struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Email       string    `gorm:"size:255;uniqueIndex;not null"`
	DisplayName string    `gorm:"size:100"`
	AvatarURL   string
	Provider    string `gorm:"size:20;default:'email_otp'"` // "google" or "email_otp"
	IsExpired   bool   `gorm:"default:false"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type Profile struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	UserID uuid.UUID `gorm:"type:uuid;uniqueIndex;not null"`
	User   User      `gorm:"constraint:OnDelete:CASCADE;"`

	Username    string `gorm:"size:32;uniqueIndex;not null"`
	DisplayName string `gorm:"size:100"`
	Bio         string `gorm:"type:text"`
	AvatarURL   string

	Theme    string `gorm:"size:50;default:'default'"`
	IsPublic bool   `gorm:"default:true"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type Session struct {
	ID string `gorm:"primaryKey;size:255"`

	UserID        uuid.UUID `gorm:"type:uuid;not null;index"`
	User          User      `gorm:"constraint:OnDelete:CASCADE;"`
	Provider      string    `gorm:"size:20;not null"` // "google" or "email_otp"
	IPAddress     string    `gorm:"size:45"`          // Supports IPv4 and IPv6
	UserAgent     string    `gorm:"type:text"`
	ExpiresAt     time.Time `gorm:"not null;index"`
	LastRotatedAt time.Time `gorm:"not null"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
}
