package bootstrap

import (
	"github.com/gofiber/fiber/v3"
)

func StartServer() {

	app := fiber.New(
		fiber.Config{
			AppName: "Lynq Server",
		},
	)

	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "ok",
		})
	})

	app.Listen(":8000")
}
