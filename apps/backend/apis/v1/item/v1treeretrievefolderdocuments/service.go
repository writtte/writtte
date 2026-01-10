package v1treeretrievefolderdocuments

import (
	"context"
	"encoding/json"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams) (*dbQueryOutput, error) {
	input := dbQueryInput{
		FolderCode: queries.FolderCode,
		Page:       queries.Page,
		PageSize:   queries.PageSize,
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
