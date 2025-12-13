package configs

import "backend/pkg/intenv"

var (
	JWTAuthSecret                 string
	JWTAuthAccessExpirationToken  string
	JWTAuthRefreshExpirationToken string
)

// revive:disable:line-length-limit

func JWTEnvs() {
	JWTAuthSecret = intenv.Load("BE_JWT_SECRET")
	JWTAuthAccessExpirationToken = intenv.Load("BE_JWT_EXPIRATION_ACCESS")
	JWTAuthRefreshExpirationToken = intenv.Load("BE_JWT_EXPIRATION_REFRESH")
}
