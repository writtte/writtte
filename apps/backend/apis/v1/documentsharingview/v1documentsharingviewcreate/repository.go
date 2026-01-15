package v1documentsharingviewcreate

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
		"SELECT schema_analytics.v1_sharing_views_create($1::JSONB)",
		map[string]any{
			"page_code":    data.PageCode,
			"visitor_id":   data.VisitorID,
			"current_date": data.CurrentDate,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	return &results, nil
}
