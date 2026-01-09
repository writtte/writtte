package v1documentsharingretrieve

import (
	"context"

	"backend/apis/v1/item/v1documentretrieve"
)

func getDocumentFileContent(ctx context.Context, accountCode,
	documentCode *string) (*string, error) {
	content, err := v1documentretrieve.GetDocumentContent(ctx,
		accountCode, documentCode)
	if err != nil {
		return nil, err
	}

	if content == nil || content.Body == nil {
		return nil, nil
	}

	return content.Body, nil
}
