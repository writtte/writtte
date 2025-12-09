package v1validatetemporarytoken

import (
	"context"
	"encoding/json"

	"backend/apis/v1/temporarytoken/v1generatetemporarytoken"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	body *BodyParams) (*dbQueryOutput, error) {
	convertedToken := v1generatetemporarytoken.ConvertTypeToMatchDB(*body.Type)

	input := dbQueryInput{
		Type:  &convertedToken,
		Key:   body.Key,
		Value: body.Value,
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
