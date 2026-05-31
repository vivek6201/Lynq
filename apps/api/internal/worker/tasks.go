package worker

const (
	TaskSendEmail = "task:send_email"
)

type SendEmailPayload struct {
	To          []string `json:"to"`
	From        string   `json:"from"`
	Subject     string   `json:"subject"`
	HtmlContent string   `json:"html_content"`
}
