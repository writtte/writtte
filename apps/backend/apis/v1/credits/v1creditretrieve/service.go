package v1creditretrieve

import (
	"context"
	"fmt"

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

	return results, nil
}

func formatCreditAmount(amount *float64) *string {
	if amount == nil {
		return nil
	}

	formattedAmount := fmt.Sprintf("%.6f", *amount)
	return &formattedAmount
}
