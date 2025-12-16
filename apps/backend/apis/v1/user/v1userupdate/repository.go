package v1userupdate

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
		"SELECT schema_main.v1_user_update($1::UUID, $2::JSONB)",
		data.AccountCode,
		map[string]any{
			"Name":              data.Name,
			"hashed_password":   data.HashedPassword,
			"password_salt":     data.PasswordSalt,
			"status":            data.Status,
			"is_email_verified": data.IsEmailVerified,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
