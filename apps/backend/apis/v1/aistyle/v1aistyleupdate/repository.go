package v1aistyleupdate

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
		"SELECT schema_main.v1_ai_style_update($1::UUID, $2::JSONB)",
		data.StyleCode,
		map[string]any{
			"account_code": data.AccountCode,
			"name":         data.Name,
			"style":        data.Style,
			"is_deleted":   data.IsDeleted,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
