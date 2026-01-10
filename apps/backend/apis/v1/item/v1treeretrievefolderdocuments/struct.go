package v1treeretrievefolderdocuments

type QueryParams struct {
	FolderCode *string `json:"folder_code" validate:"required,uuid"`
	Page       *int    `json:"page" validate:"omitempty,min=1"`
	PageSize   *int    `json:"page_size" validate:"omitempty,min=1,max=1000"`
}

type dbQueryInput struct {
	FolderCode *string
	Page       *int
	PageSize   *int
}

type dbQueryOutputDataDocuments struct {
	DocumentCode   *string `json:"document_code"`
	AccountCode    *string `json:"account_code"`
	Title          *string `json:"title"`
	LifecycleState *string `json:"lifecycle_state"`
	WorkflowState  *string `json:"workflow_state"`
	CreatedTime    *string `json:"created_time"`
	UpdatedTime    *string `json:"updated_time"`
}

type dbQueryOutputDataPagination struct {
	CurrentPage *int `json:"current_page"`
	PageSize    *int `json:"page_size"`
	TotalCount  *int `json:"total_count"`
	TotalPages  *int `json:"total_pages"`
}

type dbQueryOutputData struct {
	FolderCode *string                       `json:"folder_code"`
	Documents  []*dbQueryOutputDataDocuments `json:"documents"`
	Pagination *dbQueryOutputDataPagination  `json:"pagination"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccessDocuments struct {
	DocumentCode   *string `json:"document_code"`
	AccountCode    *string `json:"account_code"`
	Title          *string `json:"title"`
	LifecycleState *string `json:"lifecycle_state"`
	WorkflowState  *string `json:"workflow_state"`
	CreatedTime    *string `json:"created_time"`
	UpdatedTime    *string `json:"updated_time"`
}

type apiResultsSuccessPagination struct {
	CurrentPage *int `json:"current_page"`
	PageSize    *int `json:"page_size"`
	TotalCount  *int `json:"total_count"`
	TotalPages  *int `json:"total_pages"`
}

type apiResultsSuccess struct {
	FolderCode *string                       `json:"folder_code"`
	Documents  []*apiResultsSuccessDocuments `json:"documents"`
	Pagination *apiResultsSuccessPagination  `json:"pagination"`
}
