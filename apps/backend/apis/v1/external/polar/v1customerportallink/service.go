package v1customerportallink

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/configs"
	"backend/constants"
	"backend/pkg/extjwt"
	"backend/utils/apicall"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context, queries *QueryParams,
) (*dbQueryOutput, *string, error) {
	claims := ctx.Value(constants.JWTKey).(extjwt.MapClaims)  // revive:disable-line
	accountCode := claims[v1signin.ClaimAccountCode].(string) // revive:disable-line

	input := dbQueryInput{
		AccountCode: &accountCode,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, nil, err
	}

	if *parsedResults.Status &&
		*parsedResults.Code == constants.SubscriptionRetrieved {
		portalLink, err := generatePortalLink(parsedResults.Data.CustomerID,
			queries.ReturnURL)

		if err != nil {
			return parsedResults, nil, err
		}

		return parsedResults, portalLink, nil
	}

	return parsedResults, nil, nil
}

func generatePortalLink(customerID, returnURL *string) (*string, error) {
	httpClient := apicall.NewHTTPClient()

	type requestBody struct {
		CustomerID string `json:"customer_id"`
		ReturnURL  string `json:"return_url"`
	}

	body := requestBody{
		CustomerID: *customerID,
		ReturnURL:  *returnURL,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	response := httpClient.Post(
		context.Background(),
		configs.PolarAPIURL+"/v1/customer-sessions",
		configs.PolarOrganizationAccessToken,
		jsonBody,
	)

	if response.Error != nil || response.StatusCode != http.StatusOK &&
		response.StatusCode != http.StatusCreated {
		// revive:disable:line-length-limit

		errorMsg := fmt.Sprintf("unable to retrieve customer portal link: status=%d, error=%v, response=%s",
			response.StatusCode, response.Error, response.Body)

		// revive:enable:line-length-limit

		return nil, errors.New(errorMsg)
	}

	var portalResponse struct {
		URL string `json:"url"`
	}

	if err := json.Unmarshal([]byte(response.Body),
		&portalResponse); err != nil {
		return nil, err
	}

	return &portalResponse.URL, nil
}
