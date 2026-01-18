package v1aistyleretrieve

import (
	"context"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/pkg/extjwt"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	input := dbQueryInput{
		AccountCode: &accountCode,
		StyleCode:   queries.StyleCode,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	return results, nil
}
