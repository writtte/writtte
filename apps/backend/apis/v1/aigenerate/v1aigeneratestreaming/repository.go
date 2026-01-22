package v1aigeneratestreaming

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, data *dbQueryInput) (*string, error)

	performStyle(ctx context.Context, styleCode *string,
	) (*string, error)
}

func (d *database) perform(ctx context.Context,
	data *dbQueryInput) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_main.v1_credit_update($1::UUID, $2::JSONB)",
		data.AccountCode,
		map[string]any{
			"used_credit_amount": data.UsedCreditAmount,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}

func (d *database) performStyle(ctx context.Context,
	styleCode *string) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_main.v1_ai_style_retrieve($1::JSONB)",
		map[string]any{
			"style_code": styleCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
