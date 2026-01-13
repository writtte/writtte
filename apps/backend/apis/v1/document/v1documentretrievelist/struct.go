package v1documentretrievelist

// revive:disable:line-length-limit

type QueryParams struct {
	LifecycleState *string `json:"lifecycle_state" validate:"omitempty,oneof=active deleted"`
	WorkflowState  *string `json:"workflow_state" validate:"omitempty,oneof=published"`
	TitleFilter    *string `json:"title_filter" validate:"omitempty"`
	Page           *int    `json:"page" validate:"omitempty,min=1"`
	PageSize       *int    `json:"page_size" validate:"omitempty,min=1,max=1000"`
	SortBy         *string `json:"sort_by" validate:"omitempty,oneof=created_time updated_time title"`
	SortOrder      *string `json:"sort_order" validate:"omitempty,oneof=sort-asc sort-desc"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode    *string
	LifecycleState *string
	WorkflowState  *string
	TitleFilter    *string
	Page           *int
	PageSize       *int
	SortBy         *string
	SortOrder      *string
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
	Documents  []*apiResultsSuccessDocuments `json:"documents"`
	Pagination *apiResultsSuccessPagination  `json:"pagination"`
}
