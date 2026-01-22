package v1aistyleretrieve

type QueryParams struct {
	StyleCode *string `json:"style_code" validate:"required,uuid"`
}

type dbQueryInput struct {
	StyleCode *string
}

type dbQueryOutputData struct {
	StyleCode   *string `json:"style_code"`
	AccountCode *string `json:"account_code"`
	Name        *string `json:"name"`
	Style       *string `json:"style"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	StyleCode   *string `json:"style_code"`
	Name        *string `json:"name"`
	Style       *string `json:"style"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}
