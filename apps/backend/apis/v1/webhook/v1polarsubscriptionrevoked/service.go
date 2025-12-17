package v1polarsubscriptionrevoked

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
	input := dbQueryInput{
		CustomerID: body.Data.CustomerID,
		SeatCount:  body.Data.Seats,
		Service:    intstr.StrPtr("POLAR"),
		ServiceData: map[string]any{
			"webhook_payload": body,
		},
		Status: mapStatus(body.Data.Status),
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

func mapStatus(status *string) *string {
	const canceledStatus = "CANCELED"

	if status == nil {
		return intstr.StrPtr(canceledStatus)
	}

	switch *status {
	case "incomplete":
		return intstr.StrPtr("INCOMPLETE")

	case "incomplete_expired":
		return intstr.StrPtr("EXPIRED")

	case "trialing":
		return intstr.StrPtr("TRIALING")

	case "active":
		return intstr.StrPtr("ACTIVE")

	case "past_due":
		return intstr.StrPtr("PAST_DUE")

	case "canceled":
		return intstr.StrPtr(canceledStatus)

	case "unpaid":
		return intstr.StrPtr("UNPAID")

	default:
		return intstr.StrPtr(canceledStatus)
	}
}
