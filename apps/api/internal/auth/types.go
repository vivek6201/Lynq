package auth

import (
	"time"

	"github.com/google/uuid"
	"github.com/vivek6201/lynq/api/internal/users"
	"github.com/vivek6201/lynq/api/internal/worker"
	"golang.org/x/oauth2"
)

type VerificationResult struct {
	Registered bool
	SessionID  string
	UserID     uuid.UUID
	ExpiresAt  time.Time
	TempUserID uuid.UUID
}

type GoogleAuthResult struct {
	Registered bool
	SessionID  string
	UserID     uuid.UUID
	ExpiresAt  time.Time
	TempUserID uuid.UUID
}

type SessionResult struct {
	SessionID string
	UserID    uuid.UUID
	ExpiresAt time.Time
}

type AuthService struct {
	repo            *AuthRepository
	usersService    *users.UserService
	taskDistributor worker.TaskDistributor
	oauthConfig     *oauth2.Config
}
