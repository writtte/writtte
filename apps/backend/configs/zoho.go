package configs

import "backend/pkg/intenv"

var (
	ZeptoSender   string
	ZeptoTokenKey string
)

func ZohoEnvs() {
	ZeptoSender = intenv.Load("BE_ZEPTO_SENDER")
	ZeptoTokenKey = intenv.Load("BE_ZEPTO_TOKEN_KEY")
}
