package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func LoggerMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		start := time.Now()

		// Generate request ID if not already present
		reqID := c.Get("X-Request-ID")
		if reqID == "" {
			reqID = uuid.New().String()
			c.Set("X-Request-ID", reqID)
		}
		c.Locals("requestID", reqID)

		// Log incoming request
		log.Printf("[%s] [START] %s - %s %s - Client IP: %s",
			time.Now().Format("2006-01-02 15:04:05"),
			reqID,
			c.Method(),
			c.Path(),
			c.IP(),
		)

		// Process request
		err := c.Next()

		latency := time.Since(start)
		status := c.Response().StatusCode()

		// Log request completion
		log.Printf("[%s] [END] %s - %s %s - Status: %d - Latency: %v",
			time.Now().Format("2006-01-02 15:04:05"),
			reqID,
			c.Method(),
			c.Path(),
			status,
			latency,
		)

		return err
	}
}
