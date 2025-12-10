package v1signupcreate

import (
	"bytes"
	"strconv"
	"time"

	"backend/cmd/glob"
	"backend/constants"
)

func welcomeEmail(email, name, accountCode *string,
) (title, subject, content *string) {
	mailTitle := constants.TransactionalEmailTitle
	mailSubject := constants.EmailSubjectSignUpWelcome

	var result bytes.Buffer
	err := glob.Config.EmailTemplates.SignUpWelcome.
		Execute(&result, map[string]string{
			"EmailTitle":   mailSubject,
			"EmailAddress": *email,
			"Name":         *name,
			"AccountCode":  *accountCode,
			"CurrentYear":  strconv.Itoa(time.Now().Year()),
		})

	if err != nil {
		panic(err)
	}

	mailContent := result.String()
	return &mailTitle, &mailSubject, &mailContent
}
