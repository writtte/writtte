package v1aistylecreate

type BodyParams struct {
	Name  *string `json:"name" validate:"required,min=1,max=256"`
	Style *string `json:"style" validate:"required,min=1,max=10000"`
}

type dbQueryInput struct {
	AccountCode *string
	Name        *string
	Style       *string
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
