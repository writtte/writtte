package v1repositories

import (
	"context"
	"encoding/json"

	"backend/constants"
	"backend/pkg/extpgx"
)

type DBQueryOutputRetrieveCreditAmount struct {
	CreditAmount    *float64 `json:"credit_amount"`
	AllocatedAmount *float64 `json:"allocated_amount"`
	CreatedTime     *string  `json:"created_time"`
	UpdatedTime     *string  `json:"updated_time"`
}

// revive:disable:line-length-limit

type DBQueryOutputRetrieveCreditData struct {
	Subscription      *DBQueryOutputRetrieveCreditAmount `json:"subscription"`
	Manual            *DBQueryOutputRetrieveCreditAmount `json:"manual"`
	TotalCreditAmount *float64                           `json:"total_credit_amount"`
}

// revive:enable:line-length-limit

type DBQueryOutputRetrieveCredit struct {
	Status     *bool                            `json:"status"`
	Code       *string                          `json:"code"`
	Message    *string                          `json:"message"`
	Additional *string                          `json:"additional"`
	Data       *DBQueryOutputRetrieveCreditData `json:"data"`
}

func RetrieveCredit(ctx context.Context, db *extpgx.PsqlPool,
	accountCode *string) (*float64, error) {
	var results string
	err := db.Pool.QueryRow(ctx,
		"SELECT schema_main.v1_credit_retrieve($1::JSONB)",
		map[string]any{
			"account_code": accountCode,
		},
	).Scan(&results)

	if err != nil {
		return nil, err
	}

	var parsedResults *DBQueryOutputRetrieveCredit
	if err := json.Unmarshal([]byte(results),
		&parsedResults); err != nil {
		return nil, err
	}

	if *parsedResults.Code != constants.CreditRetrieved {
		const defaultAmount float64 = 0.0
		mappedDefaultAmount := defaultAmount

		return &mappedDefaultAmount, nil
	}

	return parsedResults.Data.TotalCreditAmount, nil
}
