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

	AWSS3PrivateGeneralBucketAccessKey       string
	AWSS3PrivateGeneralBucketSecretAccessKey string
	AWSS3PrivateGeneralBucketRegion          string
	AWSS3PrivateGeneralBucketName            string

	AWSS3PrivateDirectoryBucketAccountID       string
	AWSS3PrivateDirectoryBucketAccessKey       string
	AWSS3PrivateDirectoryBucketSecretAccessKey string
	AWSS3PrivateDirectoryBucketRegion          string
	AWSS3PrivateDirectoryBucketName            string

	AWSBedrockRegion          string
	AWSBedrockAccessKey       string
	AWSBedrockSecretAccessKey string
	AWSBedrockModelIDNovaLite string
)

// revive:disable:line-length-limit

func AWSEnvs() {
	AWSSESRegion = intenv.Load("BE_AWS_SES_REGION")
	AWSSESAccountAccessKey = intenv.Load("BE_AWS_SES_KEY_ACCESS")
	AWSSESAccountSecretAccessKey = intenv.Load("BE_AWS_SES_KEY_SECRET_ACCESS")
	AWSSESTransactionalSender = intenv.Load("BE_AWS_SES_TRANSACTIONAL_SENDER_ACCOUNT")
	AWSSESTransactionalConfiguration = intenv.Load("BE_AWS_SES_TRANSACTIONAL_CONFIGURATION")

	AWSS3PrivateGeneralBucketAccessKey = intenv.Load("BE_AWS_S3_KEY_ACCESS")
	AWSS3PrivateGeneralBucketSecretAccessKey = intenv.Load("BE_AWS_S3_KEY_SECRET_ACCESS")
	AWSS3PrivateGeneralBucketRegion = intenv.Load("BE_AWS_S3_REGION")
	AWSS3PrivateGeneralBucketName = intenv.Load("BE_AWS_S3_PRIVATE_GENERAL_BUCKET_NAME")

	AWSS3PrivateDirectoryBucketAccountID = intenv.Load("BE_AWS_S3_KEY_ACCOUNT_ID")
	AWSS3PrivateDirectoryBucketAccessKey = intenv.Load("BE_AWS_S3_KEY_ACCESS")
	AWSS3PrivateDirectoryBucketSecretAccessKey = intenv.Load("BE_AWS_S3_KEY_SECRET_ACCESS")
	AWSS3PrivateDirectoryBucketRegion = intenv.Load("BE_AWS_S3_REGION")
	AWSS3PrivateDirectoryBucketName = intenv.Load("BE_AWS_S3_PRIVATE_DIRECTORY_BUCKET_NAME")

	AWSBedrockRegion = intenv.Load("BE_AWS_BEDROCK_REGION")
	AWSBedrockAccessKey = intenv.Load("BE_AWS_BEDROCK_KEY_ACCESS")
	AWSBedrockSecretAccessKey = intenv.Load("BE_AWS_BEDROCK_KEY_SECRET_ACCESS")
	AWSBedrockModelIDNovaLite = intenv.Load("BE_AWS_BEDROCK_MODAL_ID_NOVA_LITE")
}
