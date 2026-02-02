package v1signinlinkgenerate

import (
	"net/http"

	"backend/configs"
	"backend/helpers/sendmail"
)

func sendSignInLink(r *http.Request, email, name, accountCode,
	accessToken, refreshToken *string) *string {
	title, subject, content, link := signInLink(email, name, accountCode,
		accessToken, refreshToken)

	info := sendmail.Info{
		Title:   title,
		To:      email,
		Subject: subject,
		Content: content,
		Config:  &configs.AWSSESTransactionalConfiguration,
	}

	sendmail.Send(r, info)
	return link
}
