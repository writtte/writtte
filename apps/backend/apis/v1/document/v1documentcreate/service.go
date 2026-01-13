package v1documentcreate

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
	body *BodyParams) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	defaultLifecycleState := "ACTIVE"
	defaultWorkflowState := "PUBLISHED"

	input := dbQueryInput{
		AccountCode:    &accountCode,
		Title:          body.Title,
		LifecycleState: &defaultLifecycleState,
		WorkflowState:  &defaultWorkflowState,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	if err := createDocumentFile(ctx, &accountCode,
		parsedResults.Data.DocumentCode); err != nil {
		return nil, err
	}

	return parsedResults, nil
}
