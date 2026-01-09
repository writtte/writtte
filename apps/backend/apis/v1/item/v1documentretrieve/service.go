package v1documentretrieve

import (
	"context"
	"encoding/json"
	"fmt"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/pkg/extaws"
	"backend/pkg/extjwt"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams) (*dbQueryOutput, *string, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	input := dbQueryInput{
		AccountCode:  &accountCode,
		DocumentCode: queries.DocumentCode,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, nil, err
	}

	var contentToPass string
	if *parsedResults.Status {
		var content *extaws.S3FileRetrieveData
		content, err = GetDocumentContent(ctx, &accountCode,
			queries.DocumentCode)

		if err != nil {
			return nil, nil, err
		}

		contentToPass = *content.Body
	}

	return parsedResults, &contentToPass, nil
}

func (s *service) performETag(ctx context.Context,
	queries *QueryParams) (*string, error) {
	results, err := s.repo.performETag(ctx, queries.DocumentCode)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutputETag
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	// revive:disable:line-length-limit

	if !*parsedResults.Status {
		return nil, fmt.Errorf("unable to retrieve eTag: status is false, message: %s",
			*parsedResults.Message)
	}

	if *parsedResults.Code != constants.DocumentRetrievedETag {
		return nil, fmt.Errorf("unable to retrieve eTag: unexpected code: %s, expected: %s",
			*parsedResults.Code, constants.DocumentRetrievedETag)
	}

	// revive:enable:line-length-limit

	return parsedResults.Data.ETag, nil
}
