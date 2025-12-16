package v1generatetemporarytoken

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"strconv"
	"time"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/utils/jsmatch"
)

func signUpLink(email, code *string) (title, subject,
	content, link *string) {
	mailTitle := constants.TransactionalEmailTitle
	mailSubject := constants.EmailSubjectSignUpLink

	generatedLink := generateSignUpLink(email, code)

	var result bytes.Buffer
	err := glob.Config.EmailTemplates.SignUpLink.
		Execute(&result, map[string]string{
			"EmailTitle":     mailSubject,
			"EmailAddress":   *email,
			"InvitationLink": generatedLink,
			"CurrentYear":    strconv.Itoa(time.Now().Year()),
		})

	if err != nil {
		panic(err)
	}

	mailContent := result.String()
	return &mailTitle, &mailSubject, &mailContent, &generatedLink
}

func generateSignUpLink(email, code *string) string {
	const (
		key   = "key"
		value = "value"
	)

	jsonData := []map[string]any{
		{
			key:   "email",
			value: *email,
		},
		{
			key:   "code",
			value: *code,
		},
		{
			key:   "time",
			value: jsmatch.GetTimeFromTime(time.Now()),
		},
	}

	jsonBytes, err := json.Marshal(jsonData)
	if err != nil {
		panic(err)
	}

	encodedData := base64.StdEncoding.EncodeToString(jsonBytes)
	return configs.FrontendURL + "/sign-up/create?data=" + encodedData
}

func emailUpdateLink(email, code, newEmailToUpdate *string) (title, subject,
	content, link *string) {
	mailTitle := constants.TransactionalEmailTitle
	mailSubject := constants.EmailSubjectAccountEmailUpdate

	generatedLink := generateEmailUpdateLink(email, code,
		newEmailToUpdate)

	var result bytes.Buffer
	err := glob.Config.EmailTemplates.AccountEmailUpdate.
		Execute(&result, map[string]string{
			"EmailTitle":              mailSubject,
			"EmailAddress":            *email,
			"NewEmailAddressToUpdate": *newEmailToUpdate,
			"ConfirmationLink":        generatedLink,
			"CurrentYear":             strconv.Itoa(time.Now().Year()),
		})

	if err != nil {
		panic(err)
	}

	mailContent := result.String()
	return &mailTitle, &mailSubject, &mailContent, &generatedLink
}

func generateEmailUpdateLink(email, code, newEmail *string) string {
	const (
		key   = "key"
		value = "value"
	)

	jsonData := []map[string]any{
		{
			key:   "email",
			value: *email,
		},
		{
			key:   "code",
			value: *code,
		},
		{
			key:   "new-email",
			value: *newEmail,
		},
		{
			key:   "time",
			value: jsmatch.GetTimeFromTime(time.Now()),
		},
	}

	jsonBytes, err := json.Marshal(jsonData)
	if err != nil {
		panic(err)
	}

	// revive:disable:line-length-limit

	encodedData := base64.StdEncoding.EncodeToString(jsonBytes)
	return configs.FrontendURL + "/temporary/validate/email-update?data=" + encodedData

	// revive:enable:line-length-limit
}
