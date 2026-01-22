package v1polarorderpaid

import (
	"context"
	"encoding/json"

	"backend/pkg/intstr"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context, body *BodyParams,
) (*dbQueryOutput, error) {
	accountCode := ""
	if val, ok := (body.Data.Metadata)["account_code"]; ok && val != nil {
		if str, ok := val.(string); ok {
			accountCode = str
		}
	}

	input := dbQueryInput{
		AccountCode: &accountCode,
		CustomerID:  body.Data.CustomerID,
		SeatCount:   getSeatCount(),
		Service:     intstr.StrPtr("POLAR"),
		ServiceData: map[string]any{
			"webhook_payload": body,
		},
		Status:                   intstr.StrPtr("ACTIVE"),
		SubscriptionCreditAmount: getSubscriptionCreditAmount(),
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	return parsedResults, nil
}

func getSeatCount() *int {
	const oneSeat = 1

	defaultSeatCount := oneSeat
	return &defaultSeatCount
}

func getSubscriptionCreditAmount() *float64 {
	const defaultAmountPerPlan = 1000.00

	amount := defaultAmountPerPlan
	return &amount
}
