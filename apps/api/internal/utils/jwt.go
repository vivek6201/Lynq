package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type SessionClaims struct {
	SessionID string `json:"session_id"`
	UserID    string `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateJWTToken creates a HS256 signed JWT containing the session ID and user ID.
func GenerateJWTToken(sessionID string, userID string, expiresAt time.Time, secret string) (string, error) {
	claims := SessionClaims{
		SessionID: sessionID,
		UserID:    userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ParseJWTToken parses a signed JWT and returns the extracted session ID and user ID.
func ParseJWTToken(tokenString string, secret string) (string, string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &SessionClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return "", "", err
	}

	if claims, ok := token.Claims.(*SessionClaims); ok && token.Valid {
		return claims.SessionID, claims.UserID, nil
	}

	return "", "", errors.New("invalid session token claims")
}
