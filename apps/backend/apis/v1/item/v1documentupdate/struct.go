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
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
