package v1treeremovedocument

type BodyParams struct {
	FolderCode   *string `json:"folder_code" validate:"required,uuid"`
	DocumentCode *string `json:"document_code" validate:"required,uuid"`
}

type dbQueryInput struct {
	FolderCode   *string
	DocumentCode *string
}

type dbQueryOutputData struct {
	FolderCode   *string `json:"folder_code"`
	DocumentCode *string `json:"document_code"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	FolderCode   *string `json:"folder_code"`
	DocumentCode *string `json:"document_code"`
}
