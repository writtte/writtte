package v1signupcreate

import (
	"context"
	"encoding/json"

	"backend/helpers/password"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	body *BodyParams) (*dbQueryOutput, error) {
	hashed, salt := password.Hash(*body.Password)

	const amount = 200.00
	defaultFreeCreditAmount := amount

	input := dbQueryInput{
		EmailAddress:       body.EmailAddress,
		Name:               body.Name,
		HashedPassword:     &hashed,
		PasswordSalt:       &salt,
		ManualCreditAmount: &defaultFreeCreditAmount,
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
