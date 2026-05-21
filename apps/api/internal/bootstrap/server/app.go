package bootstrap

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type structValidator struct {
	validate *validator.Validate
}

func (v *structValidator) Validate(out any) error {
	return v.validate.Struct(out)
}

func StartServer() {
	app := fiber.New(
		fiber.Config{
			AppName:         "Lynq Server",
			StructValidator: &structValidator{validate: validator.New()},
		},
	)

	SetupRoutes(app)
	app.Listen(":8000")
}
