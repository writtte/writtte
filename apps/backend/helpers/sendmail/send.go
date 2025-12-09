package sendmail

import (
	"net/http"

	"backend/cmd/app"
	"backend/cmd/glob"
	"backend/constants"
	"backend/pkg/extaws"
)

type Info struct {
	Title   *string // Email title or type for tagging purposes
	From    *string // Sender email address
	To      *string // Recipient email address
	Subject *string // Email subject line
	Content *string // Email content in HTML format
	Config  *string // AWS SES configuration set name
}

func Send(r *http.Request, info Info) {
	if !app.ReturnSESStatus() {
		return
	}

	if sendLocally(info) {
		return
	}

	uniqueID, ok := r.Context().Value(constants.UniqueID).(string)
	if !ok {
		uniqueID = ""
	}

	email := extaws.EmailInfo{
		Sender:    *info.From,
		Recipient: *info.To,
		Subject:   *info.Subject,
		HTMLBody:  info.Content,
		CharSet:   extaws.CharSetUTF8,
		Tags: []extaws.SESTags{
			{
				Name:  extaws.ReturnAWSString("type"),
				Value: extaws.ReturnAWSString(*info.Title),
			},
		},
		Configuration: *info.Config,
	}

	output, err := extaws.SendEmail(email, *glob.Config.AWSSESSession)
	if err != nil {
		glob.Config.Logger.Error(map[string]any{
			constants.LogID:    uniqueID,
			constants.LogError: err.Error(),
		}, constants.SESEmailSendFailed)

		return
	}

	glob.Config.Logger.Success(map[string]any{
		constants.LogID:      uniqueID,
		constants.LogDetails: output,
	}, constants.SESEmailSendSuccess)
}
