package v1generatetemporarytoken

// revive:disable:line-length-limit

type QueryParams struct {
	Type         *string `json:"type" validate:"required,oneof=sign-up-verify email-update"`
	EmailAddress *string `json:"email_address" validate:"required,email"`
}

type BodyParams struct {
	// The value for the key will depend on the type:
	// 	- `sing-up-verify`: Email address
	//  - `email-update`: Account code

	Key *string `json:"key" validate:"required,min=2,max=256"`

	// For account email address update

	NewAccountEmailAddress *string `json:"new_account_email_address" validate:"omitempty,email"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	Type              *string
	Key               *string
	Value             *string
	ExpirationMinutes *int
}

type dbQueryOutputData struct {
	Value          *string `json:"value"`
	ExpirationTime *string `json:"expiration_time"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	GeneratedLink  *string `json:"generated_link"`
	GeneratedCode  *string `json:"generated_code,omitempty"`
	ExpirationTime *string `json:"expiration_time,omitempty"`
}
