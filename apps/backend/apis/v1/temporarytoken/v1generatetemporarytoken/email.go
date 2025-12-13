package v1generatetemporarytoken

import (
	"net/http"

	"backend/configs"
	"backend/helpers/sendmail"
)

func sendSignUpEmail(r *http.Request, email, code *string) *string {
	title, subject, content, link := signUpLink(email, code)

	info := sendmail.Info{
		Title:   title,
		From:    &configs.AWSSESTransactionalSender,
		To:      email,
		Subject: subject,
		Content: content,
		Config:  &configs.AWSSESTransactionalConfiguration,
	}

	sendmail.Send(r, info)
	return link
}
