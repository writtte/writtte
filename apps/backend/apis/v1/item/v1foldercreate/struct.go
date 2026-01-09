package v1foldercreate

type BodyParams struct {
	Title *string `json:"title" validate:"required,min=1,max=256"`
}

type dbQueryInput struct {
	AccountCode *string
	Title       *string
}

type dbQueryOutputData struct {
	FolderCode *string `json:"folder_code"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	FolderCode *string `json:"folder_code"`
}
