package v1accountoverview

import (
	"context"
	"encoding/json"
	"time"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/pkg/extjwt"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	input := dbQueryInput{
		AccountCode: &accountCode,
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

func calculateFreeTrialDays(createdTimeStr *string) int {
	const hoursPerDay = 24
	const freeTrialDays = 7
	const minDays = 0

	if createdTimeStr == nil {
		return minDays
	}

	createdTime, err := time.Parse(time.RFC3339, *createdTimeStr)
	if err != nil {
		return minDays
	}

	daysSinceCreation := int(time.Since(createdTime).Hours() / hoursPerDay)

	daysRemaining := freeTrialDays - daysSinceCreation
	return max(daysRemaining, minDays)
}
