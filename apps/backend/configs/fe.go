package configs

import "backend/pkg/intenv"

var (
	FrontendURL string
)

func FrontendEnvs() {
	FrontendURL = intenv.Load("BE_FE_URL")
}
