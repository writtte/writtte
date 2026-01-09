package v1documentsharingretrieve

import (
	"context"
	"encoding/json"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	checkSharing(ctx context.Context,
		data *dbSharingCheckInput) (*string, error)

	retrieveDocument(ctx context.Context, accountCode,
		documentCode *string) (*dbDocumentRetrieveOutput, error)
}

func (d *database) checkSharing(ctx context.Context,
	data *dbSharingCheckInput) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_temporary.v1_document_sharing_check($1::JSONB)",
		map[string]any{
			"sharing_code": data.SharingCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}

func (d *database) retrieveDocument(ctx context.Context, accountCode,
	documentCode *string) (*dbDocumentRetrieveOutput, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_document_retrieve($1::JSONB)",
		map[string]any{
			"account_code":  accountCode,
			"document_code": documentCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	var documentOutput dbDocumentRetrieveOutput
	err = json.Unmarshal([]byte(results), &documentOutput)
	if err != nil {
		return nil, err
	}

	return &documentOutput, nil
}
