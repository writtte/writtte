package v1validatetemporarytoken

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, data *dbQueryInput) (*string, error)
	updateAccountEmail(ctx context.Context, emailAddress,
		accountCode *string) (*string, error)
}

func (d *database) perform(ctx context.Context,
	data *dbQueryInput) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_temporary.v1_temporary_token_update($1::JSONB)",
		map[string]any{
			"type":  data.Type,
			"key":   data.Key,
			"value": data.Value,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}

func (d *database) updateAccountEmail(ctx context.Context,
	accountCode, emailAddress *string) (*string, error) {
	var results string
	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_main.v1_user_update($1::UUID, $2::JSONB)",
		accountCode,
		map[string]any{
			"email_address":     emailAddress,
			"is_email_verified": true,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
