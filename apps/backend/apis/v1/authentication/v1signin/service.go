package v1signin

import (
	"context"
	"encoding/json"

	"backend/constants"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	body *BodyParams) (*dbQueryOutput, *apiResultsSuccess, error) {
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
		if !validatePassword(body.Password, parsedResults.Data.HashedPassword,
			parsedResults.Data.PasswordSalt) {
			*parsedResults.Code = constants.UserDynamicPasswordInvalid
		} else {
			*parsedResults.Code = constants.UserDynamicPasswordValid
		}

		accessToken, refreshToken, err :=
			GenerateTokens(parsedResults.Data.AccountCode)

		if err != nil {
			return nil, nil, err
		}

		return parsedResults, &apiResultsSuccess{
			Name:         parsedResults.Data.Name,
			EmailAddress: parsedResults.Data.EmailAddress,
			AccountCode:  parsedResults.Data.AccountCode,
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		}, nil
	}

	return parsedResults, nil, nil
}
