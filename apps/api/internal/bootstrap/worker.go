package bootstrap

import (
	"log"

	"github.com/hibiken/asynq"
	"github.com/vivek6201/lynq/api/internal/config"
	"github.com/vivek6201/lynq/api/internal/utils"
	"github.com/vivek6201/lynq/api/internal/worker"
)

func StartWorker() {
	// Load config
	cfg := config.LoadConfig()

	// Initialize Email Sender
	emailSender := utils.NewEmailSender(cfg.RESEND_KEY)

	// Initialize Redis connection
	redisOpt := asynq.RedisClientOpt{Addr: cfg.REDIS_URL}

	// Initialize Worker Processor
	processor := worker.NewRedisTaskProcessor(redisOpt, emailSender)

	if err := processor.Start(); err != nil {
		log.Fatalf("Failed to start worker: %v", err)
	}
}
