package configs

import "backend/pkg/intenv"

var (
	FeedbackEmail string
)

// revive:disable:line-length-limit

func FeedbackEnvs() {
	FeedbackEmail = intenv.Load("BE_FEEDBACK_EMAIL")
}
