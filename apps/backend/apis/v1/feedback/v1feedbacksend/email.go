package v1feedbacksend

import (
	"net/http"

	"backend/configs"
	"backend/constants"
	"backend/helpers/sendmail"
)

func sendFeedbackEmail(r *http.Request, body *BodyParams) {
	title, subject, content := constructEmail(body)

	info := sendmail.Info{
		Title:   title,
		To:      &configs.FeedbackEmail,
		Subject: subject,
		Content: content,
		Config:  &configs.AWSSESTransactionalConfiguration,
	}

	sendmail.Send(r, info)
}

func constructEmail(body *BodyParams) (title, subject,
	content *string) {
	mailTitle := constants.InternalFeedbackEmailTitle
	mailSubject := "Feedback: " + *body.Type

	// revive:disable:add-constant

	mailContent := "<html><body>" +
		"<h2>Feedback Details</h2>" +
		"<p><strong>Feedback Type:</strong> " + *body.Type + "</p>" +
		"<p><strong>Message:</strong><br>" + *body.Message + "</p>" +
		"<p><strong>From:</strong> " + *body.EmailAddress + "</p>" +
		"</body></html>"

	// revive:enable:add-constant

	return &mailTitle, &mailSubject, &mailContent
}
