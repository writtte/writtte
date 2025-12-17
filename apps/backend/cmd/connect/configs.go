package connect

import "backend/configs"

func SetupConfigs() {
	configs.EnvironmentEnvs()
	configs.LogEnvs()
	configs.ServerEnvs()
	configs.DatabaseEnvs()
	configs.FrontendEnvs()
	configs.AWSEnvs()
	configs.JWTEnvs()
	configs.PolarEnvs()
}
