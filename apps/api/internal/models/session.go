package models

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	ID            string    `gorm:"primaryKey;size:255"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;index"`
	Provider      string    `gorm:"size:20;not null"` // "google" or "email_otp"
	IPAddress     string    `gorm:"size:45"`          // Supports IPv4 and IPv6
	UserAgent     string    `gorm:"type:text"`
	ExpiresAt     time.Time `gorm:"not null;index"`
	LastRotatedAt time.Time `gorm:"not null"`
	CreatedAt     time.Time `gorm:"autoCreateTime"`
}
