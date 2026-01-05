package connect

import (
	"backend/cmd/flags"
	"backend/cmd/glob"
	"backend/configs"
	"backend/pkg/extsentry"
)

func SetupSentry() {
	var envInStr string
	switch glob.Config.Environment {
	case flags.LocalEnv:
		envInStr = "Local"

	case flags.StagingEnv:
		envInStr = "Staging"

	case flags.ProductionEnv:
		envInStr = "Production"

	default:
		panic("unknown environment found when setting up Sentry")
	}

	err := extsentry.InitSentry(configs.SentryDSN, envInStr)
	if err != nil && glob.Config.Environment != flags.LocalEnv {
		// Do not panic in local environment, as Sentry is not
		// used (sometimes) there

		panic(err)
	}
}
