package v1subscriptionretrieve

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
		"SELECT schema_main.v1_subscription_retrieve($1::JSONB)",
		map[string]any{
			"account_code": data.AccountCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
