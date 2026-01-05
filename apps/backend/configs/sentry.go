package configs

import "backend/pkg/intenv"

var (
	SentryDSN string
)

func SentryEnvs() {
	SentryDSN = intenv.Load("BE_SENTRY_DSN")
}
