package v1documentversionretrievelist

// revive:disable:line-length-limit

type QueryParams struct {
	DocumentCode *string `json:"document_code" validate:"required,uuid4"`
	StoredType   *string `json:"stored_type" validate:"omitempty,oneof=type-automatic type-manual"`
	Page         *int    `json:"page" validate:"omitempty,min=1"`
	PageSize     *int    `json:"page_size" validate:"omitempty,min=1,max=100"`
	SortOrder    *string `json:"sort_order" validate:"omitempty,oneof=sort-asc sort-desc"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode  *string
	DocumentCode *string
	StoredType   *string
	Page         *int
	PageSize     *int
	SortOrder    *string
}

type dbQueryOutputDataVersionItem struct {
	IDMain       *int64  `json:"id_main"`
	VersionCode  *string `json:"version_code"`
	DocumentCode *string `json:"document_code"`
	StoredType   *string `json:"stored_type"`
	CreatedTime  *string `json:"created_time"`
}

type dbQueryOutputDataPagination struct {
	CurrentPage *int `json:"current_page"`
	PageSize    *int `json:"page_size"`
	TotalCount  *int `json:"total_count"`
	TotalPages  *int `json:"total_pages"`
}

type dbQueryOutputData struct {
	Versions   []*dbQueryOutputDataVersionItem `json:"versions"`
	Pagination *dbQueryOutputDataPagination    `json:"pagination"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsVersionItem struct {
	VersionCode  *string `json:"version_code"`
	DocumentCode *string `json:"document_code"`
	StoredType   *string `json:"stored_type"`
	CreatedTime  *string `json:"created_time"`
}

type apiResultsPagination struct {
	CurrentPage *int `json:"current_page"`
	PageSize    *int `json:"page_size"`
	TotalCount  *int `json:"total_count"`
	TotalPages  *int `json:"total_pages"`
}

type apiResultsSuccess struct {
	Versions   []*apiResultsVersionItem `json:"versions"`
	Pagination *apiResultsPagination    `json:"pagination"`
}
