package v1folderupdate

type QueryParams struct {
	FolderCode *string `json:"folder_code" validate:"required,uuid"`
}

type BodyParams struct {
	Title *string `json:"title" validate:"omitempty,min=1,max=256"`
}

type dbQueryInput struct {
	FolderCode  *string
	AccountCode *string
	Title       *string
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
