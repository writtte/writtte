package v1polarorderpaid

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
		"SELECT schema_main.v1_subscription_update($1::UUID, $2::JSONB)",
		data.AccountCode,
		map[string]any{
			"customer_id":  data.CustomerID,
			"seat_count":   data.SeatCount,
			"service":      data.Service,
			"service_data": data.ServiceData,
			"status":       data.Status,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
