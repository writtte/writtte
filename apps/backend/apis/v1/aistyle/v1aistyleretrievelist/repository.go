package v1aistyleretrievelist

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
		"SELECT schema_main.v1_ai_style_retrieve_list($1::JSONB)",
		map[string]any{
			"account_code": data.AccountCode,
			"limit":        data.Limit,
			"offset":       data.Offset,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
