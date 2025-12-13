package configs

import "backend/pkg/intenv"

var (
	AllowedOrigins string
	AllowedMethods string
	AllowedHeaders string
)

func ServerEnvs() {
	AllowedOrigins = intenv.Load("BE_ALLOWED_ORIGINS")
	AllowedMethods = intenv.Load("BE_ALLOWED_METHODS")
	AllowedHeaders = intenv.Load("BE_ALLOWED_HEADERS")
}
