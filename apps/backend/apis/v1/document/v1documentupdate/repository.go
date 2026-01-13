package v1documentupdate

import (
	"context"

	"backend/pkg/extpgx"
)

type database struct {
	DB *extpgx.PsqlPool
}

type repository interface {
	perform(ctx context.Context, data *dbQueryInput) (*string, error)

	performVersionCreate(ctx context.Context,
		data *dbQueryInputVersionData) (*string, error)
}

func (d *database) perform(ctx context.Context,
	data *dbQueryInput) (*string, error) {
	var results string

	// revive:disable:line-length-limit

	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_document_update($1::UUID, $2::JSONB)",
		data.DocumentCode,
		map[string]any{
			"account_code":    data.AccountCode,
			"title":           data.Title,
			"lifecycle_state": data.LifecycleState,
			"workflow_state":  data.WorkflowState,
			"e_tag":           data.ETag,
		},
	).Scan(&results)

	// revive:enable:line-length-limit

	if err != nil {
		return nil, err
	}

	return &results, nil
}

func (d *database) performVersionCreate(ctx context.Context,
	data *dbQueryInputVersionData) (*string, error) {
	var results string

	// revive:disable:line-length-limit

	err := d.DB.Pool.QueryRow(ctx,
		"SELECT schema_item.v1_version_create($1::JSONB)",
		map[string]any{
			"document_code": data.DocumentCode,
			"stored_type":   data.StoredType,
			"current_time":  data.CurrentTime,
			"time_to_check": data.TimeToCheck,
		},
	).Scan(&results)

	// revive:enable:line-length-limit

	if err != nil {
		return nil, err
	}

	return &results, nil
}
