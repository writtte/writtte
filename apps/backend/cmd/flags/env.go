package flags

func checkEnvironment(env string) int {
	var envType int
	switch env {
	case "local":
		envType = LocalEnv

	case "staging":
		envType = StagingEnv

	case "production":
		envType = ProductionEnv

	default:
		panic("invalid environment type provided in flags")
	}

	return envType
}
