package v1folderupdate

import (
	"context"
	"encoding/json"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams, body *BodyParams) (*dbQueryOutput, error) {
	input := dbQueryInput{
		FolderCode: queries.FolderCode,
		Title:      body.Title,
	}

	results, err := s.repo.perform(ctx, queries.FolderCode, &input)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	return parsedResults, nil
}
