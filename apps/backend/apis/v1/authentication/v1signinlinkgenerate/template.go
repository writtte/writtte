package v1signinlinkgenerate

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"html/template"
	"strconv"
	"time"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/utils/jsmatch"
)

func signInLink(email, name, code, accessToken,
	refreshToken *string) (title, subject, content, link *string) {
	mailTitle := constants.TransactionalEmailTitle
	mailSubject := constants.EmailSubjectSignInQuickLink

	generatedLink := generateQuickSignInLink(email, name, code,
		accessToken, refreshToken)

	var result bytes.Buffer
	err := glob.Config.EmailTemplates.SignInQuickLink.
		Execute(&result, map[string]any{
			"EmailTitle":   mailSubject,
			"EmailAddress": *email,
			"SignInLink":   template.URL(generatedLink), // #nosec G203
			"CurrentYear":  strconv.Itoa(time.Now().Year()),
		})

	if err != nil {
		panic(err)
	}

	mailContent := result.String()
	return &mailTitle, &mailSubject, &mailContent, &generatedLink
}

func generateQuickSignInLink(email, name, code, accessToken,
	refreshToken *string) string {
	const (
		key   = "key"
		value = "value"
	)

	jsonData := []map[string]any{
		{
			key:   "name",
			value: *name,
		},
		{
			key:   "account_code",
			value: *code,
		},
		{
			key:   "email_address",
			value: *email,
		},
		{
			key:   "access_token",
			value: *accessToken,
		},
		{
			key:   "refresh_token",
			value: *refreshToken,
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

	return configs.FrontendURL + "/sign-in/check?data=" + encodedData
}
