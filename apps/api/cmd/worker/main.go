package main

import (
	"github.com/joho/godotenv"
	"github.com/vivek6201/lynq/api/internal/bootstrap"
)

func main() {
	// Load environment variables if .env exists
	_ = godotenv.Load()

	bootstrap.StartWorker()
}
