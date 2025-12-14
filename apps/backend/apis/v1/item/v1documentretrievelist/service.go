package v1documentretrievelist

import (
	"context"
	"encoding/json"

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
		AccountCode:    &accountCode,
		LifecycleState: queries.LifecycleState,
		WorkflowState:  queries.WorkflowState,
		TitleFilter:    queries.TitleFilter,
		Page:           queries.Page,
		PageSize:       queries.PageSize,
		SortBy:         queries.SortBy,
		SortOrder:      queries.SortOrder,
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
