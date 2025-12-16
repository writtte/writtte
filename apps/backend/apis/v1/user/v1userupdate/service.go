package v1userupdate

import (
	"context"
	"encoding/json"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/helpers/password"
	"backend/pkg/extjwt"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context, body *BodyParams,
) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	var hashed, salt string
	if body.Password != nil {
		hashed, salt = password.Hash(*body.Password)
	}

	input := dbQueryInput{
		AccountCode:     &accountCode,
		Name:            body.Name,
		HashedPassword:  &hashed,
		PasswordSalt:    &salt,
		Status:          body.Status,
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
