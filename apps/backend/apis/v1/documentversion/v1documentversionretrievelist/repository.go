package v1documentversionretrievelist

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, data *dbQueryInput) (*string, error)
}

func (d *database) perform(ctx context.Context,
	data *dbQueryInput) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_version_retrieve_list($1::JSONB)",
		map[string]any{
			"account_code":  data.AccountCode,
			"document_code": data.DocumentCode,
			"stored_type":   data.StoredType,
			"page":          data.Page,
			"page_size":     data.PageSize,
			"sort_order":    data.SortOrder,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
