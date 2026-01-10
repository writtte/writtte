package v1folderupdate

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, folderCode *string,
		data *dbQueryInput) (*string, error)
}

func (d *database) perform(ctx context.Context, folderCode *string,
	data *dbQueryInput) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_folder_update($1::UUID, $2::JSONB)",
		folderCode,
		map[string]any{
			"title": data.Title,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
