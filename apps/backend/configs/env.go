package configs

import "backend/pkg/intenv"

var (
	Environment string
)

func EnvironmentEnvs() {
	Environment = intenv.Load("ENVIRONMENT")
}
