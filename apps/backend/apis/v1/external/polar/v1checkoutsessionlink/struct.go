package v1checkoutsessionlink

// revive:disable:line-length-limit

type QueryParams struct {
	ReturnURL *string `json:"return_url" validate:"required,http_url"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode *string
}

type dbQueryOutputData struct {
	EmailAddress *string `json:"email_address"`
	Name         *string `json:"name"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	CheckoutLink *string `json:"checkout_link"`
}
