package v1documentsharingdelete

type BodyParams struct {
	DocumentCode *string `json:"document_code" validate:"required,uuid4"`
	SharingCode  *string `json:"sharing_code" validate:"required,min=7,max=7"`
}

type dbQueryInput struct {
	AccountCode  *string
	DocumentCode *string
	SharingCode  *string
}

type dbQueryOutputData struct {
	AccountCode  *string `json:"account_code"`
	DocumentCode *string `json:"document_code"`
	DeletedCount *int    `json:"deleted_count"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	AccountCode  *string `json:"account_code"`
	DocumentCode *string `json:"document_code"`
	DeletedCount *int    `json:"deleted_count"`
}
