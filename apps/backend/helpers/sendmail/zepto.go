package sendmail

import (
	"context"
	"encoding/json"
	"net/http"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/utils/apicall"
)

type zeptoEmailAddress struct {
	Address string `json:"address"`
	Name    string `json:"name,omitempty"`
}

type zeptoEmailRecipient struct {
	EmailAddress zeptoEmailAddress `json:"email_address"`
}

// revive:disable:line-length-limit

type zeptoPayload struct {
	From            zeptoEmailAddress     `json:"from"`
	To              []zeptoEmailRecipient `json:"to"`
	Subject         string                `json:"subject"`
	HTMLBody        string                `json:"htmlbody"`
	TrackClicks     bool                  `json:"track_clicks"`
	TrackOpens      bool                  `json:"track_opens"`
	ClientReference string                `json:"client_reference"`
	MimeHeaders     map[string]string     `json:"mime_headers"`
}

// revive:enable:line-length-limit

func sendViaZepto(info Info, uniqueID string) {
	payload := createZeptoPayload(info, uniqueID)

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		logError(uniqueID, err.Error())
		return
	}

	resp := sendRequest(payloadBytes)
	if resp.Error != nil {
		logError(uniqueID, resp.Error.Error())
		return
	}

	if resp.StatusCode < http.StatusOK ||
		resp.StatusCode >= http.StatusMultipleChoices {
		logError(uniqueID, "non-success status code", resp.Body)
		return
	}

	glob.Config.Logger.Success(map[string]any{
		constants.LogID:      uniqueID,
		constants.LogDetails: resp.Body,
	}, constants.SESEmailSendSuccess)
}

func getSenderInfo(info Info) zeptoEmailAddress {
	const emptyStr = ""

	address := configs.ZeptoSender

	name := emptyStr
	if info.Title != nil && *info.Title != emptyStr {
		name = *info.Title
	}

	return zeptoEmailAddress{
		Address: address,
		Name:    name,
	}
}

func getRecipientInfo(info Info) zeptoEmailAddress {
	return zeptoEmailAddress{
		Address: *info.To,
	}
}

func createZeptoPayload(info Info, uniqueID string) zeptoPayload {
	sender := getSenderInfo(info)
	recipient := getRecipientInfo(info)

	return zeptoPayload{
		From: sender,
		To: []zeptoEmailRecipient{
			{
				EmailAddress: recipient,
			},
		},
		Subject:         *info.Subject,
		HTMLBody:        *info.Content,
		TrackClicks:     true,
		TrackOpens:      true,
		ClientReference: uniqueID,
		MimeHeaders: map[string]string{
			"email-type": "transactional-email",
		},
	}
}

func logError(uniqueID, errMsg string, details ...string) {
	const minLength = 0

	logData := map[string]any{
		constants.LogID:    uniqueID,
		constants.LogError: errMsg,
	}

	if len(details) > minLength {
		logData[constants.LogDetails] = details[minLength]
	}

	glob.Config.Logger.Error(logData, constants.SESEmailSendFailed)
}

func sendRequest(payloadBytes []byte) *apicall.APIResponse {
	client := apicall.NewHTTPClient()

	headers := map[string]string{
		"Accept":        "application/json",
		"Content-Type":  "application/json",
		"Authorization": configs.ZeptoTokenKey,
	}

	resp := client.MakeAPICall(context.Background(),
		apicall.APIRequest{
			URL:     "https://api.zeptomail.com/v1.1/email",
			Method:  http.MethodPost,
			Headers: headers,
			Body:    payloadBytes,
		})

	return &resp
}
