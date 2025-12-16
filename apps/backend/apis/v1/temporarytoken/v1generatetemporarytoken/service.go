package v1generatetemporarytoken

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"

	"backend/pkg/intstr"
)

type service struct {
	repo repository
}

type TokenType int

const (
	TypeSignUpVerify TokenType = iota
	TypeEmailUpdate
)

func (s *service) perform(ctx context.Context,
	queries *QueryParams, body *BodyParams,
) (*dbQueryOutput, *TokenType, error) {
	tokenType := checkType(*queries.Type)
	expirationMinutes := getExpirationMinutes(tokenType)

	value := generateTokenValue()

	input := dbQueryInput{
		Type:              intstr.StrPtr(ConvertTypeToMatchDB(*queries.Type)),
		Key:               body.Key,
		Value:             value,
		ExpirationMinutes: &expirationMinutes,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, nil, err
	}

	return parsedResults, &tokenType, nil
}

func generateTokenValue() *string {
	const length = 7

	// revive:disable:line-length-limit
	const charset = "abcdefghijklmnopqrstuvwxyz!@#$%^*()_+-=[]{}|;~"
	// revive:enable:line-length-limit

	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return nil
	}

	for i, b := range bytes {
		bytes[i] = charset[b%byte(len(charset))]
	}

	code := string(bytes)
	return &code
}

func checkType(tokenType string) TokenType {
	switch tokenType {
	case "sign-up-verify":
		return TypeSignUpVerify

	case "email-update":
		return TypeEmailUpdate

	default:
		panic(fmt.Sprintf("invalid token type %s", tokenType))
	}
}

func ConvertTypeToMatchDB(tokenType string) string {
	switch tokenType {
	case "sign-up-verify":
		return "SIGN_UP_VERIFY"

	case "email-update":
		return "EMAIL_UPDATE"

	default:
		panic(fmt.Sprintf("invalid token type %s", tokenType))
	}
}

func getExpirationMinutes(tokenType TokenType) int {
	const (
		oneHour     = 60
		halfHour    = 30
		quarterHour = 15
	)

	switch tokenType {
	case TypeSignUpVerify:
		return oneHour

	case TypeEmailUpdate:
		return halfHour

	default:
		return quarterHour
	}
}
