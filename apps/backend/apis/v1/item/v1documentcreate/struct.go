package v1documentcreate

type BodyParams struct {
	Title *string `json:"title" validate:"required,min=2,max=256"`
}

type dbQueryInput struct {
	AccountCode    *string
	Title          *string
	LifecycleState *string
	WorkflowState  *string
}

type dbQueryOutputData struct {
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
	DocumentCode *string `json:"document_code"`
}
