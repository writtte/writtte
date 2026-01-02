package v1s3presignedurl

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	performImageCreate(ctx context.Context, documentCode,
		imageCode *string) (*string, error)
}

func (d *database) performImageCreate(ctx context.Context,
	documentCode, imageCode *string) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_image_create($1::JSONB)",
		map[string]any{
			"document_code": documentCode,
			"image_code":    imageCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
