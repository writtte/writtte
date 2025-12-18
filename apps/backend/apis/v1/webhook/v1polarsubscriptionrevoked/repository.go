package v1polarsubscriptionrevoked

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

	// revive:disable:line-length-limit

	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_main.v1_subscription_update_via_customer_id($1::UUID, $2::JSONB)",
		data.CustomerID,
		map[string]any{
			"seat_count":   data.SeatCount,
			"service":      data.Service,
			"service_data": data.ServiceData,
			"status":       data.Status,
		},
	).Scan(&results)

	// revive:enable:line-length-limit

	if err != nil {
		return nil, err
	}

	return &results, nil
}
