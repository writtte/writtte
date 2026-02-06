package sendmail

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/utils/apicall"
)

type birdEmailAddress struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type birdRecipient struct {
	Address  birdEmailAddress `json:"address"`
	RcptType string           `json:"rcpt_type"`
}

type birdContent struct {
	From    string `json:"from"`
	Subject string `json:"subject"`
	HTML    string `json:"html"`
}

type birdOptions struct {
	OpenTracking    bool `json:"open_tracking"`
	ClickTracking   bool `json:"click_tracking"`
	Transactional   bool `json:"transactional"`
	Sandbox         bool `json:"sandbox"`
	SkipSuppression bool `json:"skip_suppression"`
}

// revive:disable:line-length-limit

type birdPayload struct {
	Recipients []birdRecipient `json:"recipients"`
	Content    birdContent     `json:"content"`
	Options    birdOptions     `json:"options"`
	Metadata   map[string]any  `json:"metadata,omitempty"`
}

// revive:enable:line-length-limit

func sendViaBird(info Info, uniqueID string) {
	payload := createBirdPayload(info, uniqueID)

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		logBirdError(uniqueID, err.Error())
		return
	}

	resp := sendBirdRequest(payloadBytes)
	if resp.Error != nil {
		logBirdError(uniqueID, resp.Error.Error())
		return
	}

	if resp.StatusCode < http.StatusOK ||
		resp.StatusCode >= http.StatusMultipleChoices {
		logBirdError(uniqueID, fmt.Sprintf("non-success status code: %d",
			resp.StatusCode), resp.Body)

		return
	}

	glob.Config.Logger.Success(map[string]any{
		constants.LogID:      uniqueID,
		constants.LogDetails: resp.Body,
	}, constants.SESEmailSendSuccess)
}

func getBirdRecipientInfo(info Info) birdRecipient {
	const emptyStr = ""

	name := emptyStr
	if info.Title != nil && *info.Title != emptyStr {
		name = *info.Title
	}

	return birdRecipient{
		Address: birdEmailAddress{
			Email: *info.To,
			Name:  name,
		},
		RcptType: "to",
	}
}

func createBirdPayload(info Info, uniqueID string) birdPayload {
	sender := configs.BirdSender
	recipient := getBirdRecipientInfo(info)

	return birdPayload{
		Recipients: []birdRecipient{recipient},
		Content: birdContent{
			From:    sender,
			Subject: *info.Subject,
			HTML:    *info.Content,
		},
		Options: birdOptions{
			OpenTracking:    true,
			ClickTracking:   true,
			Transactional:   true,
			Sandbox:         false,
			SkipSuppression: false,
		},
		Metadata: map[string]any{
			"email_type": "transactional-email",
			"unique_id":  uniqueID,
		},
	}
}

func logBirdError(uniqueID, errMsg string, details ...string) {
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

func getBirdAPIURL() string {
	region := configs.BirdRegion
	if region == "" {
		region = "eu"
	}

	var baseURL string
	switch region {
	case "us":
		baseURL = "https://email.us-west-2.api.bird.com"

	case "eu":
		baseURL = "https://email.eu-west-1.api.bird.com"

	default:
		baseURL = "https://email.eu-west-1.api.bird.com"
	}

	return fmt.Sprintf("%s/api/workspaces/%s/reach/transmissions",
		baseURL, configs.BirdWorkspaceID)
}

func sendBirdRequest(payloadBytes []byte) *apicall.APIResponse {
	client := apicall.NewHTTPClient()

	headers := map[string]string{
		"Accept":        "application/json",
		"Content-Type":  "application/json",
		"Authorization": "AccessKey " + configs.BirdAPIKey,
	}

	resp := client.MakeAPICall(context.Background(),
		apicall.APIRequest{
			URL:     getBirdAPIURL(),
			Method:  http.MethodPost,
			Headers: headers,
			Body:    payloadBytes,
		})

	return &resp
}
