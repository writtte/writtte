package v1customerportallink

type QueryParams struct {
	ReturnURL *string `json:"return_url" validate:"required,http_url"`
}

type dbQueryInput struct {
	AccountCode *string
}

type dbQueryOutputData struct {
	CustomerID *string `json:"customer_id"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	PortalLink *string `json:"portal_link"`
}
