package v1signupcreate

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
		"SELECT schema_main.v1_user_create($1::JSONB)",
		map[string]any{
			"email_address":        data.EmailAddress,
			"name":                 data.Name,
			"hashed_password":      data.HashedPassword,
			"password_salt":        data.PasswordSalt,
			"manual_credit_amount": data.ManualCreditAmount,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
