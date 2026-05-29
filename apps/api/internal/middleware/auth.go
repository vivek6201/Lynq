package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/vivek6201/lynq/api/internal/models"
	"github.com/vivek6201/lynq/api/internal/utils"
	"gorm.io/gorm"
)

func AuthMiddleware(db *gorm.DB) fiber.Handler {
	return func(c fiber.Ctx) error {
		log.Println("[DEBUG] AuthMiddleware executed")
		var sessionID string

		// 1. Try to read from Authorization header: Bearer <session_id>
		authHeader := c.Get("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				sessionID = parts[1]
			}
		}

		// 2. Fallback to cookie
		if sessionID == "" {
			sessionID = c.Cookies("session_id")
		}

		if sessionID == "" {
			return utils.SendError(c, fiber.StatusUnauthorized, "Missing session identifier", nil)
		}

		// 3. Query the session in the database
		var session models.Session
		if err := db.Where("id = ?", sessionID).First(&session).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return utils.SendError(c, fiber.StatusUnauthorized, "Invalid or expired session", err)
			}
			return utils.SendError(c, fiber.StatusInternalServerError, "Database error", err)
		}

		// 4. Check if expired
		if time.Now().After(session.ExpiresAt) {
			// Clean up expired session asynchronously
			go func(sid string) {
				db.Where("id = ?", sid).Delete(&models.Session{})
			}(session.ID)

			return utils.SendError(c, fiber.StatusUnauthorized, "Session has expired", nil)
		}

		// 5. Check if session rotation is needed (older than 24 hours)
		if time.Since(session.LastRotatedAt) > 24*time.Hour {
			newSessionID, err := generateSecureToken()
			if err != nil {
				return utils.SendError(c, fiber.StatusInternalServerError, "Internal server error during session rotation", err)
			}

			// In a transaction, delete old session ID and insert the new one
			err = db.Transaction(func(tx *gorm.DB) error {
				newSession := session
				newSession.ID = newSessionID
				newSession.LastRotatedAt = time.Now()

				// Insert the new session
				if err := tx.Create(&newSession).Error; err != nil {
					return err
				}

				// Delete the old session
				if err := tx.Where("id = ?", session.ID).Delete(&models.Session{}).Error; err != nil {
					return err
				}

				return nil
			})

			if err != nil {
				return utils.SendError(c, fiber.StatusInternalServerError, "Failed to rotate session", err)
			}

			// Update the active session details
			sessionID = newSessionID
			session.ID = newSessionID
			session.LastRotatedAt = time.Now()

			// Set response headers and cookies with new session ID
			c.Set("X-New-Session-Id", newSessionID)
			c.Cookie(&fiber.Cookie{
				Name:     "session_id",
				Value:    newSessionID,
				Path:     "/",
				HTTPOnly: true,
				Secure:   false, // Set to true if deploying over HTTPS
				Expires:  session.ExpiresAt,
			})
		}

		// 6. Set variables in context locals
		c.Locals("userID", session.UserID.String())
		c.Locals("sessionID", sessionID)
		log.Printf("[DEBUG] AuthMiddleware - Setting Locals(\"userID\"): %s", session.UserID.String())

		return c.Next()
	}
}

func generateSecureToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
