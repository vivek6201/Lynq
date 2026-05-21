package config

import "os"

type ConfigVar struct {
	DB_URL string
	PORT   string
}

func LoadConfig() *ConfigVar {
	return &ConfigVar{
		DB_URL: os.Getenv("DB_URL"),
		PORT:   os.Getenv("PORT"),
	}
}
