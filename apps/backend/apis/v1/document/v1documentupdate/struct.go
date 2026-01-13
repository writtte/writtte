package v1documentupdate

type QueryParams struct {
	DocumentCode *string `json:"document_code" validate:"required,uuid"`
}

// revive:disable:line-length-limit

type BodyParams struct {
	Title          *string `json:"title" validate:"omitempty,min=2,max=256"`
	LifecycleState *string `json:"lifecycle_state" validate:"omitempty,oneof=active deleted"`
	WorkflowState  *string `json:"workflow_state" validate:"omitempty,oneof=published"`
	Content        *string `json:"content" validate:"omitempty"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode    *string
	DocumentCode   *string
	Title          *string
	LifecycleState *string
	WorkflowState  *string
	ETag           *string
}

type dbQueryInputVersionData struct {
	DocumentCode *string
	StoredType   *string
	CurrentTime  *string
	TimeToCheck  *int
}

type dbQueryOutputCreateVersionData struct {
	DocumentCode *string `json:"document_code"`
	VersionCode  *string `json:"version_code"`
	StoredType   *string `json:"stored_type"`
}

type dbQueryOutputCreateVersion struct {
	Status     *bool                           `json:"status"`
	Code       *string                         `json:"code"`
	Message    *string                         `json:"message"`
	Additional *string                         `json:"additional"`
	Data       *dbQueryOutputCreateVersionData `json:"data"`
}

type dbQueryOutputData struct {
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
	ETag *string `json:"e_tag"`
}
