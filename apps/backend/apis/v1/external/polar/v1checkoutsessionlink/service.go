package v1checkoutsessionlink

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
) (*string, error) {
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

	if *parsedResults.Status &&
		*parsedResults.Code == constants.UserRetrieved {
		productID := getProductID(queries.Product)

		checkoutLink, err := generateCheckoutLink(parsedResults.Data.Name,
			parsedResults.Data.EmailAddress, &productID, queries.ReturnURL)

		if err != nil {
			return nil, err
		}

		return checkoutLink, nil
	}

	return nil, err
}

func generateCheckoutLink(name, email, product, returnURL *string,
) (*string, error) {
	httpClient := apicall.NewHTTPClient()

	type requestBody struct {
		Products      []string `json:"products"`
		CustomerName  string
		CustomerEmail string
		ReturnURL     string `json:"return_url,omitempty"`
	}

	body := requestBody{
		Products: []string{
			*product,
		},
		CustomerName:  *name,
		CustomerEmail: *email,
		ReturnURL:     *returnURL,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	response := httpClient.Post(
		context.Background(),
		configs.PolarAPIURL+"/v1/checkouts",
		configs.PolarOrganizationAccessToken,
		jsonBody,
	)

	if response.Error != nil || response.StatusCode != http.StatusOK &&
		response.StatusCode != http.StatusCreated {
		// revive:disable:line-length-limit

		errorMsg := fmt.Sprintf("unable to retrieve customer session link: status=%d, error=%v, response=%s",
			response.StatusCode, response.Error, response.Body)

		return nil, errors.New(errorMsg)

		// revive:enable:line-length-limit
	}

	var checkoutResponse struct {
		URL string `json:"url"`
	}

	if err := json.Unmarshal([]byte(response.Body),
		&checkoutResponse); err != nil {
		return nil, err
	}

	return &checkoutResponse.URL, nil
}

func getProductID(planType *string) string {
	switch *planType {
	case "solo-monthly":
		return configs.PolarPlanProductIDSoloMonthly

	case "solo-yearly":
		return configs.PolarPlanProductIDSoloYearly
	}

	panic(fmt.Sprintf("invalid plan type %s passed", *planType))
}
