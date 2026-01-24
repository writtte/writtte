package v1creditretrieve

import (
	"context"
	"encoding/json"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, data *dbQueryInput) (*dbQueryOutput, error)
}

func (d *database) perform(ctx context.Context,
	data *dbQueryInput) (*dbQueryOutput, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_main.v1_credit_retrieve($1::JSONB)",
		map[string]any{
			"account_code": data.AccountCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	var output dbQueryOutput
	err = json.Unmarshal([]byte(results), &output)
	if err != nil {
		return nil, err
	}

	return &output, nil
}
