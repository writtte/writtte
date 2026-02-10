package v1generatetemporarytoken

import (
	"net/http"

	"backend/configs"
	"backend/helpers/sendmail"
)

func sendSignUpEmail(_ *http.Request, email, code *string) *string {
	_, _, _, link := signUpLink(email, code)

	// Temporarily disable the sign-up verification email link.
	//
	// info := sendmail.Info{
	// 	Title:   title,
	// 	To:      email,
	// 	Subject: subject,
	// 	Content: content,
	// 	Config:  &configs.AWSSESTransactionalConfiguration,
	// }

	// sendmail.Send(r, info)

	return link
}

func sendEmailUpdateEmail(r *http.Request, email, code, accountCode,
	newEmailToUpdate *string) *string {
	title, subject, content, link := emailUpdateLink(email, code,
		accountCode, newEmailToUpdate)

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
