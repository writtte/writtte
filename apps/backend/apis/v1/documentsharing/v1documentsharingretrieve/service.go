package v1documentsharingretrieve

import (
	"context"
	"encoding/json"

	"backend/constants"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	queries *QueryParams) (*dbDocumentRetrieveOutput, *string, error) {
	sharingResult, err := s.validateSharingCode(ctx, queries.SharingCode)
	if err != nil {
		return nil, nil, err
	}

	if !isSharingValid(sharingResult) {
		return createErrorResponse(sharingResult), nil, nil
	}

	documentResult, err := s.repo.retrieveDocument(ctx,
		sharingResult.Data.AccountCode,
		sharingResult.Data.DocumentCode)
	if err != nil {
		return nil, nil, err
	}

	if !*documentResult.Status ||
		*documentResult.Code != constants.DocumentRetrieved {
		return documentResult, nil, nil
	}

	content, err := getDocumentFileContent(ctx,
		sharingResult.Data.AccountCode,
		sharingResult.Data.DocumentCode)
	if err != nil {
		return nil, nil, err
	}

	return documentResult, content, nil
}

func (s *service) validateSharingCode(ctx context.Context,
	sharingCode *string) (*dbSharingCheckOutput, error) {
	input := dbSharingCheckInput{
		SharingCode: sharingCode,
	}

	sharingResult, err := s.repo.checkSharing(ctx, &input)
	if err != nil {
		return nil, err
	}

	var parsedResult dbSharingCheckOutput
	if err := json.Unmarshal([]byte(*sharingResult),
		&parsedResult); err != nil {
		return nil, err
	}

	return &parsedResult, nil
}

func isSharingValid(result *dbSharingCheckOutput) bool {
	return *result.Status &&
		*result.Code == constants.DocumentSharingExists &&
		result.Data != nil &&
		result.Data.DocumentCode != nil &&
		result.Data.AccountCode != nil
}

func createErrorResponse(result *dbSharingCheckOutput,
) *dbDocumentRetrieveOutput {
	return &dbDocumentRetrieveOutput{
		Status:     result.Status,
		Code:       result.Code,
		Message:    result.Message,
		Additional: result.Additional,
		Data:       nil,
	}
}
