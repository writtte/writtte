package v1folderretrievelist

// revive:disable:line-length-limit

type QueryParams struct {
	TitleFilter *string `json:"title_filter" validate:"omitempty"`
	Page        *int    `json:"page" validate:"omitempty,min=1"`
	PageSize    *int    `json:"page_size" validate:"omitempty,min=1,max=1000"`
	SortBy      *string `json:"sort_by" validate:"omitempty,oneof=created_time updated_time title"`
	SortOrder   *string `json:"sort_order" validate:"omitempty,oneof=ASC DESC"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode *string
	TitleFilter *string
	Page        *int
	PageSize    *int
	SortBy      *string
	SortOrder   *string
}

type dbQueryOutputDataFolders struct {
	FolderCode  *string `json:"folder_code"`
	AccountCode *string `json:"account_code"`
	Title       *string `json:"title"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}

type dbQueryOutputDataPagination struct {
	CurrentPage *int `json:"current_page"`
	PageSize    *int `json:"page_size"`
	TotalCount  *int `json:"total_count"`
	TotalPages  *int `json:"total_pages"`
}

type dbQueryOutputData struct {
	Folders    []*dbQueryOutputDataFolders  `json:"folders"`
	Pagination *dbQueryOutputDataPagination `json:"pagination"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccessFolders struct {
	FolderCode  *string `json:"folder_code"`
	AccountCode *string `json:"account_code"`
	Title       *string `json:"title"`
	CreatedTime *string `json:"created_time"`
	UpdatedTime *string `json:"updated_time"`
}

type apiResultsSuccessPagination struct {
	CurrentPage *int `json:"current_page"`
	PageSize    *int `json:"page_size"`
	TotalCount  *int `json:"total_count"`
	TotalPages  *int `json:"total_pages"`
}

type apiResultsSuccess struct {
	Folders    []*apiResultsSuccessFolders  `json:"folders"`
	Pagination *apiResultsSuccessPagination `json:"pagination"`
}
