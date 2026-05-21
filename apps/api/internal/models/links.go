package models

import (
	"time"

	"github.com/google/uuid"
)

type Link struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	Title       string    `json:"title" gorm:"size:255;not null"`
	Description string    `json:"description" gorm:"type:text"`
	OriginalURL string    `json:"original_url" gorm:"type:text;not null"`
	ShortCode   string    `json:"short_code" gorm:"size:32;uniqueIndex;not null"`
	IconURL     string    `json:"icon_url"`
	Position    int       `json:"position" gorm:"default:0"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	ClickCount  int64     `json:"click_count" gorm:"default:0"`

	StartAt *time.Time `json:"start_at,omitempty"`
	EndAt   *time.Time `json:"end_at,omitempty"`

	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
