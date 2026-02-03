package configs

import "backend/pkg/intenv"

var (
	ZeptoSender   string
	ZeptoTokenKey string
)

func ZohoEnvs() {
	ZeptoSender = intenv.Load("ZEPTO_SENDER")
	ZeptoTokenKey = intenv.Load("ZEPTO_TOKEN_KEY")
}
