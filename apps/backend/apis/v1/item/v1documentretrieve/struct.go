package v1documentretrieve

type QueryParams struct {
	DocumentCode *string `json:"item_code" validate:"required,uuid"`
}

type dbQueryInput struct {
	AccountCode  *string
	DocumentCode *string
}

type dbQueryOutputData struct {
	DocumentCode   *string `json:"document_code"`
	AccountCode    *string `json:"account_code"`
	Title          *string `json:"title"`
	LifecycleState *string `json:"lifecycle_state"`
	WorkflowState  *string `json:"workflow_state"`
	CreatedTime    *string `json:"created_time"`
	UpdatedTime    *string `json:"updated_time"`
	DeletedTime    *string `json:"deleted_time"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	Title          *string `json:"title"`
	LifecycleState *string `json:"lifecycle_state"`
	WorkflowState  *string `json:"workflow_state"`
	Content        *string `json:"content"`
}
