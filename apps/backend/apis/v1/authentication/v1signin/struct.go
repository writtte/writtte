package v1signin

// revive:disable:line-length-limit

type BodyParams struct {
	EmailAddress *string `json:"email_address" validate:"required,email"`
	Password     *string `json:"password" validate:"required,min=2,max=256"` // #nosec G117
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	EmailAddress *string
}

type dbQueryOutputData struct {
	Name           *string `json:"name"`
	EmailAddress   *string `json:"email_address"`
	AccountCode    *string `json:"account_code"`
	HashedPassword *string `json:"hashed_password"`
	PasswordSalt   *string `json:"password_salt"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	Name         *string `json:"name"`
	EmailAddress *string `json:"email_address"`
	AccountCode  *string `json:"account_code"`
	AccessToken  *string `json:"access_token"`  // #nosec G117
	RefreshToken *string `json:"refresh_token"` // #nosec G117
}
