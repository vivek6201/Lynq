package worker

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
	"github.com/vivek6201/lynq/api/internal/utils"
)

type TaskProcessor interface {
	Start() error
	ProcessTaskSendEmail(ctx context.Context, task *asynq.Task) error
}

type RedisTaskProcessor struct {
	server      *asynq.Server
	emailSender *utils.EmailSender
}

func NewRedisTaskProcessor(redisOpt asynq.RedisConnOpt, emailSender *utils.EmailSender) TaskProcessor {
	server := asynq.NewServer(
		redisOpt,
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"default": 10,
			},
		},
	)

	return &RedisTaskProcessor{
		server:      server,
		emailSender: emailSender,
	}
}

func (processor *RedisTaskProcessor) Start() error {
	mux := asynq.NewServeMux()
	mux.HandleFunc(TaskSendEmail, processor.ProcessTaskSendEmail)

	return processor.server.Run(mux)
}

func (processor *RedisTaskProcessor) ProcessTaskSendEmail(ctx context.Context, task *asynq.Task) error {
	var payload SendEmailPayload
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		return fmt.Errorf("failed to unmarshal payload: %w", err)
	}

	params := &utils.EmailParams{
		To:          payload.To,
		From:        payload.From,
		Subject:     payload.Subject,
		HtmlContent: payload.HtmlContent,
	}

	if err := processor.emailSender.SendEmail(params); err != nil {
		return fmt.Errorf("failed to send email via Resend: %w", err)
	}

	fmt.Printf("Successfully sent email to %v\n", payload.To)
	return nil
}
