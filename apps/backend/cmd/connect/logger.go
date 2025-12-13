package connect

import (
	"backend/cmd/glob"
	"backend/configs"
	extgolog "backend/pkg/extlog"
)

func SetupLogger() {
	glob.Config = &glob.GlobalConfiguration{
		Logger: extgolog.InitLogger(extgolog.Config{
			Destination: configs.LogDestination,
			Rotation:    configs.LogRotation,
		}),
	}
}
