package extaws

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"
)

type AWSSESConfig = aws.Config

type AWSSESSession = ses.Client

type SESSendEmailInput = ses.SendEmailInput

type SESSendEmailOutput = ses.SendEmailOutput

type SESTags = types.MessageTag

type EmailInfo struct {
	Sender        string    // Email address of the sender
	Recipient     string    // Email address of the recipient
	Subject       string    // Subject line of the email
	HTMLBody      *string   // HTML content of the email body
	CharSet       string    // Character set to use for the email (e.g., UTF-8)
	Tags          []SESTags // Tags to attach to the email for tracking
	Configuration string    // SES configuration set name to use
}

type SESConfig struct {
	Region          *string // AWS region for SES service
	AccessKey       *string // AWS access key ID
	SecretAccessKey *string // AWS secret access key
	SessionToken    string  // AWS session token (optional)
}

const (
	CharSetUTF8 = "UTF-8"
)

func InitSESConfig(cfg SESConfig) (AWSSESConfig, error) {
	sesConfig, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(*cfg.Region),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(*cfg.AccessKey,
				*cfg.SecretAccessKey, cfg.SessionToken)),
	)

	return sesConfig, err
}

func InitSESSession(sesConfig *AWSSESConfig) *AWSSESSession {
	return ses.NewFromConfig(*sesConfig)
}

func SendEmail(info EmailInfo, sesSession AWSSESSession,
) (*SESSendEmailOutput, error) {
	emailInput := setEmailInformation(info)

	return sesSession.SendEmail(context.TODO(), emailInput)
}

func setEmailInformation(info EmailInfo) *SESSendEmailInput {
	return &ses.SendEmailInput{
		Destination: &types.Destination{
			ToAddresses: []string{info.Recipient},
		},
		Message: &types.Message{
			Body: &types.Body{
				Html: &types.Content{
					Data:    aws.String(*info.HTMLBody),
					Charset: aws.String(info.CharSet),
				},
			},
			Subject: &types.Content{
				Data:    aws.String(info.Subject),
				Charset: aws.String(info.CharSet),
			},
		},
		Source:               aws.String(info.Sender),
		Tags:                 info.Tags,
		ConfigurationSetName: aws.String(info.Configuration),
	}
}

func ReturnAWSString(str string) *string {
	return aws.String(str)
}
