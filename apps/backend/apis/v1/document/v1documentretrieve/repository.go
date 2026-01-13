package v1documentretrieve

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, data *dbQueryInput) (*string, error)

	performETag(ctx context.Context, documentCode *string,
	) (*string, error)
}

func (d *database) perform(ctx context.Context,
	data *dbQueryInput) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_document_retrieve($1::JSONB)",
		map[string]any{
			"account_code":  data.AccountCode,
			"document_code": data.DocumentCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}

func (d *database) performETag(ctx context.Context,
	documentCode *string) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_document_retrieve_etag($1)",
		documentCode,
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
