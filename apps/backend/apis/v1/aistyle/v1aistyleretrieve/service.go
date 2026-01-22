package v1aistyleretrieve

import (
	"context"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams) (*dbQueryOutput, error) {
	input := dbQueryInput{
		StyleCode: queries.StyleCode,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	return results, nil
}
