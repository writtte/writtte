package v1aistyleretrievelist

type QueryParams struct {
	Limit  *int `json:"limit" validate:"omitempty,min=1,max=1000"`
	Offset *int `json:"offset" validate:"omitempty,min=0"`
}

type dbQueryInput struct {
	AccountCode *string
	Limit       *int
	Offset      *int
}

type dbQueryOutputDataItem struct {
	StyleCode   *string `json:"style_code"`
	AccountCode *string `json:"account_code"`
	Name        *string `json:"name"`
	Style       *string `json:"style"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}

type dbQueryOutputData struct {
	Total  *int                     `json:"total"`
	Limit  *int                     `json:"limit"`
	Offset *int                     `json:"offset"`
	Items  []*dbQueryOutputDataItem `json:"items"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsItem struct {
	AccountCode *string `json:"account_code"`
	StyleCode   *string `json:"style_code"`
	Name        *string `json:"name"`
	Style       *string `json:"style"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}

type apiResultsSuccess struct {
	Total  *int              `json:"total"`
	Limit  *int              `json:"limit"`
	Offset *int              `json:"offset"`
	Items  []*apiResultsItem `json:"items"`
}
