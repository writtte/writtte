package v1accountoverview

type dbQueryInput struct {
	AccountCode *string
}

type dbQueryOutputDataUser struct {
	AccountCode     *string `json:"account_code"`
	EmailAddress    *string `json:"email_address"`
	Name            *string `json:"name"`
	Status          *string `json:"status"`
	IsEmailVerified *bool   `json:"is_email_verified"`
	UpdatedTime     *string `json:"updated_time"`
}

type dbQueryOutputData struct {
	User *dbQueryOutputDataUser `json:"user"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	AccountCode     *string `json:"account_code"`
	EmailAddress    *string `json:"email_address"`
	Name            *string `json:"name"`
	Status          *string `json:"status"`
	IsEmailVerified *bool   `json:"is_email_verified"`
	UpdatedTime     *string `json:"updated_time"`
}
