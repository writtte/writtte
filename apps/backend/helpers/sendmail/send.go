package sendmail

import (
	"fmt"
	"net/http"

	"backend/cmd/flags"
	"backend/constants"
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
	if !flags.ReturnEmailSendStatus() {
		return
	}

	if sendLocally(info) {
		return
	}

	uniqueID, ok := r.Context().Value(constants.UniqueID).(string)
	if !ok {
		uniqueID = ""
	}

	emailClient := flags.ReturnEmailClient()
	switch emailClient {
	case "ses":
		sendViaSES(info, uniqueID)

	case "zepto":
		sendViaZepto(info, uniqueID)

	default:
		panic(fmt.Sprintf("invalid email client '%s' detected",
			emailClient))
	}
}
