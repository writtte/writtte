package configs

import (
	"backend/pkg/intenv"
)

var (
	AWSSESRegion                     string
	AWSSESAccountAccessKey           string
	AWSSESAccountSecretAccessKey     string
	AWSSESTransactionalSender        string
	AWSSESTransactionalConfiguration string
)

// revive:disable:line-length-limit

func AWSEnvs() {
	AWSSESRegion = intenv.Load("BE_AWS_SES_REGION")
	AWSSESAccountAccessKey = intenv.Load("BE_AWS_SES_KEY_ACCESS")
	AWSSESAccountSecretAccessKey = intenv.Load("BE_AWS_SES_KEY_SECRET_ACCESS")
	AWSSESTransactionalSender = intenv.Load("BE_AWS_SES_TRANSACTIONAL_SENDER_ACCOUNT")
	AWSSESTransactionalConfiguration = intenv.Load("BE_AWS_SES_TRANSACTIONAL_CONFIGURATION")
}
