package v1folderretrieve

type QueryParams struct {
	FolderCode *string `json:"folder_code" validate:"required,uuid"`
}

type dbQueryInput struct {
	AccountCode *string
	FolderCode  *string
}

type dbQueryOutputData struct {
	FolderCode  *string `json:"folder_code"`
	Title       *string `json:"title"`
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
	FolderCode  *string `json:"folder_code"`
	AccountCode *string `json:"account_code"`
	Title       *string `json:"title"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}
