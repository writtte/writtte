package v1folderretrievelist

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
		"SELECT schema_item.v1_folder_retrieve_list($1::JSONB)",
		map[string]any{
			"account_code": data.AccountCode,
			"title_filter": data.TitleFilter,
			"page":         data.Page,
			"page_size":    data.PageSize,
			"sort_by":      data.SortBy,
			"sort_order":   data.SortOrder,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
