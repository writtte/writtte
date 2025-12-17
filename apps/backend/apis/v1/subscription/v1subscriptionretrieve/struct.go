package v1subscriptionretrieve

type dbQueryInput struct {
	AccountCode *string
}

type dbQueryOutputData struct {
	CustomerID  *string        `json:"customer_id"`
	SeatCount   *int           `json:"seat_count"`
	Service     *string        `json:"service"`
	ServiceData map[string]any `json:"service_data"`
	Status      *string        `json:"status"`
	CreatedTime *string        `json:"created_time"`
	UpdatedTime *string        `json:"updated_time"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	CustomerID  *string        `json:"customer_id"`
	SeatCount   *int           `json:"seat_count"`
	Service     *string        `json:"service"`
	ServiceData map[string]any `json:"service_data"`
	Status      *string        `json:"status"`
}
