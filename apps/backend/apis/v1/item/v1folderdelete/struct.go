package v1folderdelete

type QueryParams struct {
	FolderCode *string `json:"folder_code" validate:"required,uuid"`
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
