package v1documentversionretrievelist

import (
	"context"
	"encoding/json"
	"fmt"

	"backend/apis/v1/authentication/v1signin"
	"backend/constants"
	"backend/pkg/extjwt"
	"backend/pkg/intstr"
)

type service struct {
	repo repository
}

const itemErrorMsg = "invalid value %s identified"

func (s *service) perform(ctx context.Context,
	queries *QueryParams) (*dbQueryOutput, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	input := dbQueryInput{
		AccountCode:  &accountCode,
		DocumentCode: queries.DocumentCode,
		StoredType:   setStoredType(queries),
		Page:         queries.Page,
		PageSize:     queries.PageSize,
		SortOrder:    setSortOrder(queries),
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

func setStoredType(queries *QueryParams) *string {
	if queries.StoredType == nil {
		return nil
	}

	switch *queries.StoredType {
	case "type-automatic":
		return intstr.StrPtr("AUTOMATIC")

	case "type-manual":
		return intstr.StrPtr("MANUAL")

	default:
		panic(fmt.Sprintf(itemErrorMsg, *queries.StoredType))
	}
}

func setSortOrder(queries *QueryParams) *string {
	if queries.SortOrder == nil {
		return nil
	}

	switch *queries.SortOrder {
	case "sort-asc":
		return intstr.StrPtr("ASC")

	case "sort-desc":
		return intstr.StrPtr("DESC")

	default:
		panic(fmt.Sprintf(itemErrorMsg, *queries.SortOrder))
	}
}
