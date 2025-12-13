package configs

import "backend/pkg/intenv"

var (
	LogRotation    string
	LogDestination string
)

func LogEnvs() {
	LogRotation = intenv.Load("BE_LOG_ROTATION")
	LogDestination = intenv.Load("BE_LOG_DESTINATION")
}
