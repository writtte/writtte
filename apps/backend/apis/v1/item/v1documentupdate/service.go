package v1documentupdate

import (
	"context"
	"encoding/json"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/helpers/dbconvert"
	"backend/pkg/extjwt"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams, body *BodyParams) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	input := dbQueryInput{
		AccountCode:    &accountCode,
		DocumentCode:   queries.DocumentCode,
		Title:          body.Title,
		LifecycleState: updateLifecycleState(body),
		WorkflowState:  updateWorkflowState(body),
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	if body.Content != nil {
		if err := updateContent(ctx, &accountCode, queries.DocumentCode,
			body.Content); err != nil {
			return nil, err
		}
	}

	return parsedResults, nil
}

func updateLifecycleState(body *BodyParams) *string {
	if body.LifecycleState == nil {
		return nil
	}

	convertedStatus := dbconvert.ItemLifecycleStateToDB(body.LifecycleState)
	return &convertedStatus
}

func updateWorkflowState(body *BodyParams) *string {
	if body.WorkflowState == nil {
		return nil
	}

	convertedType := dbconvert.ItemWorkflowStateToDB(body.WorkflowState)
	return &convertedType
}
