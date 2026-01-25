package configs

import "backend/pkg/intenv"

var (
	LangToolAPIURL string
)

// revive:disable:line-length-limit

func LangToolEnvs() {
	LangToolAPIURL = intenv.Load("BE_LANG_TOOL_API_URL")
}
