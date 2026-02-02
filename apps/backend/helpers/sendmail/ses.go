package sendmail

import (
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/pkg/extaws"
)

func sendViaSES(info Info, uniqueID string) {
	address := configs.AWSSESTransactionalSender

	email := extaws.EmailInfo{
		Sender:    address,
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
