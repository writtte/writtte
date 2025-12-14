package v1documentretrieve

import (
	"context"
	"encoding/base64"
	"encoding/json"

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

	var encodedContent string
	if *parsedResults.Status {
		var content *extaws.S3FileRetrieveData
		content, err = getDocumentContent(ctx, &accountCode,
			queries.DocumentCode)

		if err != nil {
			return nil, nil, err
		}

		encodedContent = base64.RawStdEncoding.
			EncodeToString([]byte(*content.Body))
	}

	return parsedResults, &encodedContent, nil
}
