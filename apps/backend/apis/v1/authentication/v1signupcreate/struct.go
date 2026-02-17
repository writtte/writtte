package v1signupcreate

// revive:disable:line-length-limit

type BodyParams struct {
	EmailAddress *string `json:"email_address" validate:"required,email"`
	Name         *string `json:"name" validate:"required,min=2,max=256"`
	Password     *string `json:"password" validate:"required,min=2,max=256"` // #nosec G117
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	EmailAddress       *string
	Name               *string
	HashedPassword     *string
	PasswordSalt       *string
	ManualCreditAmount *float64
}

type dbQueryOutputData struct {
	AccountCode *string `json:"account_code"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}
