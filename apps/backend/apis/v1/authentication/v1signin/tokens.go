package v1signin

import (
	"errors"
	"strconv"
	"time"

	"backend/configs"
	"backend/pkg/extjwt"
)

const (
	ClaimAccountCode = "accountCode"
)

func GenerateTokens(accountCode *string) (accessToken *string,
	refreshToken *string, err error) {
	if accountCode == nil {
		return nil, nil, errors.New("account code is nil")
	}

	secretKey, err := extjwt.DecodeSecretKey(configs.JWTAuthSecret)
	if err != nil {
		return nil, nil, err
	}

	accessMinutes, refreshDays, err := parseExpirationConfig()
	if err != nil {
		return nil, nil, err
	}

	accessExp, refreshExp := calculateExpirationTimes(accessMinutes,
		refreshDays)

	accessTokenInfo := createAccessTokenInfo(secretKey,
		*accountCode, accessExp)

	refreshTokenInfo := createRefreshTokenInfo(secretKey,
		*accountCode, refreshExp)

	var generatedAccessToken, generatedRefreshToken string

	generatedAccessToken, err = extjwt.GenerateToken(accessTokenInfo)
	if err != nil {
		return nil, nil, err
	}

	generatedRefreshToken, err = extjwt.GenerateToken(refreshTokenInfo)
	if err != nil {
		return nil, nil, err
	}

	return &generatedAccessToken, &generatedRefreshToken, nil
}

func parseExpirationConfig() (accessMinutes int, refreshDays int,
	err error) {
	const zero = 0
	accessMinutes, err = strconv.Atoi(configs.JWTAuthAccessExpirationToken)
	if err != nil {
		return zero, zero, err
	}

	refreshDays, err = strconv.Atoi(configs.JWTAuthRefreshExpirationToken)
	if err != nil {
		return zero, zero, err
	}

	return accessMinutes, refreshDays, nil
}

func calculateExpirationTimes(accessMinutes int,
	refreshDays int) (accessExp, refreshExp time.Time) {
	const (
		zeroYears  = 0
		zeroMonths = 0
	)

	accessExp = time.Now().Add(time.Duration(accessMinutes) * time.Minute)
	refreshExp = time.Now().AddDate(zeroYears, zeroMonths, refreshDays)
	return accessExp, refreshExp
}

func createAccessTokenInfo(secretKey []byte, accountCode string,
	expiration time.Time) extjwt.Info {
	return extjwt.Info{
		Token:     string(secretKey),
		Sign:      extjwt.SigningMethodHS256,
		Algorithm: extjwt.JWTAlgorithmHS256,
		Type:      extjwt.JWTType,
		Claims: extjwt.Claims{
			Exp: expiration.Unix(),
			Iat: time.Now().Unix(),
			Custom: &map[string]any{
				ClaimAccountCode: accountCode,
			},
		},
	}
}

func createRefreshTokenInfo(secretKey []byte, accountCode string,
	expiration time.Time) extjwt.Info {
	return extjwt.Info{
		Token:     string(secretKey),
		Sign:      extjwt.SigningMethodHS256,
		Algorithm: extjwt.JWTAlgorithmHS256,
		Type:      extjwt.JWTType,
		Claims: extjwt.Claims{
			Exp: expiration.Unix(),
			Iat: time.Now().Unix(),
			Custom: &map[string]any{
				ClaimAccountCode: accountCode,
			},
		},
	}
}
