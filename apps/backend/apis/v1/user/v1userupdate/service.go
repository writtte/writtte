package v1userupdate

import (
	"context"
	"encoding/json"
	"fmt"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/helpers/password"
	"backend/pkg/extjwt"
	"backend/pkg/intstr"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context, body *BodyParams,
) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	var hashed, salt *string
	if body.Password != nil {
		hashedPassword, passwordSalt := password.Hash(*body.Password)

		hashed = &hashedPassword
		salt = &passwordSalt
	}

	input := dbQueryInput{
		AccountCode:     &accountCode,
		Name:            body.Name,
		HashedPassword:  hashed,
		PasswordSalt:    salt,
		Status:          intstr.StrPtr(convertStatusToMatchDB(*body.Status)),
		IsEmailVerified: body.IsEmailVerified,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	return parsedResults, nil
}

func convertStatusToMatchDB(statusType string) string {
	switch statusType {
	case "pending-deletion":
		return "PENDING_DELETION"

	default:
		panic(fmt.Sprintf("invalid status type %s", statusType))
	}
}
