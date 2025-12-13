package v1signinlinkgenerate

import (
	"context"
	"encoding/json"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	body *BodyParams) (*dbQueryOutput, *serviceResults, error) {
	input := dbQueryInput{
		EmailAddress: body.EmailAddress,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, nil, err
	}

	if *parsedResults.Code == constants.UserRetrieved {
		accessToken, refreshToken, err :=
			v1signin.GenerateTokens(parsedResults.Data.AccountCode)

		if err != nil {
			return nil, nil, err
		}

		return parsedResults, &serviceResults{
			Name:         parsedResults.Data.Name,
			EmailAddress: parsedResults.Data.EmailAddress,
			AccountCode:  parsedResults.Data.AccountCode,
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		}, nil
	}

	return parsedResults, nil, nil
}
