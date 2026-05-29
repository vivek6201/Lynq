package main

import (
	"log"

	"github.com/joho/godotenv"
	bootstrap "github.com/vivek6201/lynq/api/internal/bootstrap/server"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Info: No .env file loaded: %v", err)
	}
	bootstrap.StartServer()
}
