package v1signinlinkgenerate

type BodyParams struct {
	EmailAddress *string `json:"email_address" validate:"required,email"`
}

type dbQueryInput struct {
	EmailAddress *string
}

type dbQueryOutputData struct {
	Name         *string `json:"name"`
	EmailAddress *string `json:"email_address"`
	AccountCode  *string `json:"account_code"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type serviceResults struct {
	Name         *string `json:"name"`
	EmailAddress *string `json:"email_address"`
	AccountCode  *string `json:"account_code"`
	AccessToken  *string `json:"access_token"`  // #nosec G117
	RefreshToken *string `json:"refresh_token"` // #nosec G117
}

type apiResultsSuccess struct {
	GeneratedLink *string `json:"generated_link"`
}
