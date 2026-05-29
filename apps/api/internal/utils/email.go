package utils

import (
	"log"
)

type EmailSender interface {
	SendOTP(email string, otp string) error
}

type MockEmailSender struct{}

func NewMockEmailSender() *MockEmailSender {
	return &MockEmailSender{}
}

func (s *MockEmailSender) SendOTP(email string, otp string) error {
	log.Printf("\n==================================================\n"+
		"[EMAIL] Send OTP to: %s\n"+
		"OTP Code: %s\n"+
		"Expires in 5 minutes\n"+
		"==================================================\n", email, otp)
	return nil
}
