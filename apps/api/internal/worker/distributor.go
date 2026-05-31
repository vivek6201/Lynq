package worker

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
)

type TaskDistributor interface {
	DistributeTaskSendEmail(ctx context.Context, payload *SendEmailPayload, opts ...asynq.Option) error
}

type RedisTaskDistributor struct {
	client *asynq.Client
}

func NewRedisTaskDistributor(redisOpt asynq.RedisConnOpt) TaskDistributor {
	client := asynq.NewClient(redisOpt)
	return &RedisTaskDistributor{
		client: client,
	}
}

func (distributor *RedisTaskDistributor) DistributeTaskSendEmail(ctx context.Context, payload *SendEmailPayload, opts ...asynq.Option) error {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal task payload: %w", err)
	}

	task := asynq.NewTask(TaskSendEmail, jsonPayload, opts...)
	info, err := distributor.client.EnqueueContext(ctx, task)
	if err != nil {
		return fmt.Errorf("failed to enqueue task: %w", err)
	}

	fmt.Printf("Enqueued task: type=%s queue=%s id=%s\n", info.Type, info.Queue, info.ID)
	return nil
}
