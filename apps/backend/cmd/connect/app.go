package connect

import (
	"net/http"

	"backend/cmd/flags"
	"backend/cmd/glob"
	"backend/configs"
	"backend/embeds"
	"backend/pkg/extaws"
	"backend/pkg/extpgx"
	"backend/pkg/extvalidator"
)

// revive:disable:line-length-limit

func SetupApp() {
	// Note:
	//
	// Do not change the order of the calls

	glob.Config.Environment = flags.ReturnEnvironment()
	glob.Config.RunningMode = flags.ReturnMode()
	glob.Config.HTTPHandler = http.NewServeMux()
	glob.Config.MainSQLDB = &extpgx.PsqlPool{}
	glob.Config.EmailTemplates = embeds.SetupEmailTemplates()
	glob.Config.RateLimit = flags.ReturnRateLimitStatus()
	glob.Config.Validator = extvalidator.Init()

	if flags.ReturnSESStatus() {
		const emptySession = ""
		cfg, err := extaws.InitSESConfig(extaws.SESConfig{
			Region:          &configs.AWSSESRegion,
			AccessKey:       &configs.AWSSESAccountAccessKey,
			SecretAccessKey: &configs.AWSSESAccountSecretAccessKey,
			SessionToken:    emptySession,
		})

		if err != nil {
			panic(err)
		}

		glob.Config.AWSSESConfig = &cfg
		glob.Config.AWSSESSession =
			extaws.InitSESSession(glob.Config.AWSSESConfig)
	}

	glob.Config.AWSS3PrivateDirectoryBucketClient = extaws.InitS3(extaws.S3Config{
		Region:            &configs.AWSS3PrivateDirectoryBucketRegion,
		AccessKey:         &configs.AWSS3PrivateDirectoryBucketAccessKey,
		SecretAccessKey:   &configs.AWSS3PrivateDirectoryBucketSecretAccessKey,
		IsDirectoryBucket: true,
	})

	// Always add local selection at the end of the
	// configuration flow

	glob.Config.UseLocalSESInLocalEnv =
		glob.Config.Environment == flags.LocalEnv
}

// revive:enable:line-length-limit
