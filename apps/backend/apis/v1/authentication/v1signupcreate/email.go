package v1signupcreate

import (
	"net/http"

	"backend/configs"
	"backend/helpers/sendmail"
)

func sendSignUpEmail(r *http.Request, email, name, accountCode *string,
) {
	title, subject, content := welcomeEmail(email, name, accountCode)

	info := sendmail.Info{
		Title:   title,
		From:    &configs.AWSSESTransactionalSender,
		To:      email,
		Subject: subject,
		Content: content,
		Config:  &configs.AWSSESTransactionalConfiguration,
	}

	sendmail.Send(r, info)
}
