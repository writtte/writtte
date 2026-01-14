package v1documentupdate

import (
	"context"
	"encoding/json"
	"math/rand/v2"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/helpers/dbconvert"
	"backend/pkg/extjwt"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams, body *BodyParams) (*dbQueryOutput, *string, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	eTag := generateDocumentEtag()

	input := dbQueryInput{
		AccountCode:    &accountCode,
		DocumentCode:   queries.DocumentCode,
		Title:          body.Title,
		LifecycleState: updateLifecycleState(body),
		WorkflowState:  updateWorkflowState(body),
		ETag:           eTag,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, nil, err
	}

	if body.Content != nil {
		err := updateContent(ctx, &accountCode, queries.DocumentCode,
			body.Content)

		if err != nil {
			return nil, nil, err
		}

		// If the content is successfully updated, create the version
		// history after checking the time.

		s.checkAndSetVersionFile(ctx, queries.DocumentCode,
			body.Content, parsedResults.Data.UpdatedTime)
	}

	return parsedResults, eTag, nil
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

func generateDocumentEtag() *string {
	// revive:disable:line-length-limit

	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	const charStrLength = 62 // (26 uppercase letters + 26 lowercase letters + 10 digits)

	const tagLength = 8

	// revive:enable:line-length-limit

	b := make([]byte, tagLength)
	x := rand.Uint64() // #nosec G404

	for i := range tagLength {
		b[i] = chars[x%charStrLength]
		x /= charStrLength
	}

	etag := string(b)
	return &etag
}
