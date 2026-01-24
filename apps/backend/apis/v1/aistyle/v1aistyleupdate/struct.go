package v1aistyleupdate

type QueryParams struct {
	StyleCode *string `json:"style_code" validate:"required,uuid"`
}

type BodyParams struct {
	Name      *string `json:"name" validate:"omitempty,min=1,max=256"`
	Style     *string `json:"style" validate:"omitempty,min=1,max=10000"`
	IsDeleted *bool   `json:"is_deleted" validate:"omitempty"`
}

type dbQueryInput struct {
	AccountCode *string
	StyleCode   *string
	Name        *string
	Style       *string
	IsDeleted   *bool
}

type dbQueryOutputData struct {
	StyleCode *string `json:"style_code"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	StyleCode *string `json:"style_code"`
}
