package models

import (
	"time"

	"github.com/google/uuid"
)

type Link struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	UserID uuid.UUID `gorm:"type:uuid;not null;index"`
	User   User      `gorm:"constraint:OnDelete:CASCADE;"`

	Title       string `gorm:"size:255;not null"`
	Description string `gorm:"type:text"`
	Url         string `gorm:"type:text;not null"`
	IconURL     string
	Position    int  `gorm:"default:0"`
	IsActive    bool `gorm:"default:false"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type LinkStats struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	LinkID uuid.UUID `gorm:"type:uuid;uniqueIndex;not null"`
	Link   Link      `gorm:"constraint:OnDelete:CASCADE;"`

	TotalClicks int64 `gorm:"default:0"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type LinkClickEvent struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	LinkID uuid.UUID `gorm:"type:uuid;not null;index"`
	Link   Link      `gorm:"constraint:OnDelete:CASCADE;"`

	Country string `gorm:"size:100"`
	City    string `gorm:"size:100"`

	Browser string `gorm:"size:100"`
	OS      string `gorm:"size:100"`
	Device  string `gorm:"size:100"`

	Referrer string `gorm:"type:text"`

	ClickedAt time.Time `gorm:"index"`
}

type SocialLink struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	ProfileID uuid.UUID `gorm:"type:uuid;not null;index"`
	Profile   Profile   `gorm:"constraint:OnDelete:CASCADE;"`
	Platform  string    `gorm:"size:50"`
	URL       string    `gorm:"type:text"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type LinkAnalytics struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	LinkID     uuid.UUID `gorm:"type:uuid;not null;index"`
	Link       Link      `gorm:"constraint:OnDelete:CASCADE;"`
	ClickCount int64     `gorm:"default:0"`

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
