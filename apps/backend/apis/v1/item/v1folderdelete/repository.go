package v1folderdelete

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, folderCode *string) (*string, error)
}

func (d *database) perform(ctx context.Context,
	folderCode *string) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_folder_delete($1::UUID)",
		folderCode,
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
