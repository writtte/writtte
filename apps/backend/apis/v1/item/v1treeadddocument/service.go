package v1treeadddocument

import (
	"context"
	"encoding/json"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	body *BodyParams) (*dbQueryOutput, error) {
	input := dbQueryInput{
		FolderCode:   body.FolderCode,
		DocumentCode: body.DocumentCode,
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
