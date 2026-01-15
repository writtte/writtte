package v1documentsharingviewcreate

type BodyParams struct {
	PageCode  *string `json:"page_code" validate:"required,min=7,max=7"`
	VisitorID *string `json:"visitor_id" validate:"required,uuid4"`
}

type dbQueryInput struct {
	PageCode    *string
	VisitorID   *string
	CurrentDate *string
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
