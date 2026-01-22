package v1aigeneratestreaming

import (
	"context"
	"encoding/json"

	"backend/constants"
)

// revive:disable:cognitive-complexity

type dbQueryOutputStyleData struct {
	Style *string `json:"style"`
}

type dbQueryOutputStyle struct {
	Status     *bool                   `json:"status"`
	Code       *string                 `json:"code"`
	Message    *string                 `json:"message"`
	Additional *string                 `json:"additional"`
	Data       *dbQueryOutputStyleData `json:"data"`
}

func (s *service) getStyleByCode(ctx context.Context,
	styleCode *string) (*string, error) {
	if styleCode == nil {
		return nil, nil
	}

	results, err := s.repo.performStyle(ctx, styleCode)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutputStyle
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	if parsedResults == nil {
		return nil, nil
	}

	if parsedResults.Status == nil || !*parsedResults.Status {
		return nil, nil
	}

	if parsedResults.Code == nil {
		return nil, nil
	}

	if *parsedResults.Code != constants.AIStyleRetrieved {
		return nil, nil
	}

	if parsedResults.Data == nil {
		return nil, nil
	}

	return parsedResults.Data.Style, nil
}
