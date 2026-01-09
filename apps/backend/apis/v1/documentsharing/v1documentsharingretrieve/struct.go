package v1documentsharingretrieve

type QueryParams struct {
	SharingCode *string `json:"sharing_code" validate:"required,min=7,max=7"`
}

type dbSharingCheckInput struct {
	SharingCode *string
}

type dbSharingCheckOutputData struct {
	Available    *bool   `json:"available"`
	AccountCode  *string `json:"account_code"`
	DocumentCode *string `json:"document_code"`
}

type dbSharingCheckOutput struct {
	Status     *bool                     `json:"status"`
	Code       *string                   `json:"code"`
	Message    *string                   `json:"message"`
	Additional *string                   `json:"additional"`
	Data       *dbSharingCheckOutputData `json:"data"`
}

type dbDocumentRetrieveOutput struct {
	Status     *bool                 `json:"status"`
	Code       *string               `json:"code"`
	Message    *string               `json:"message"`
	Additional *string               `json:"additional"`
	Data       *dbDocumentOutputData `json:"data"`
}

type dbDocumentOutputData struct {
	DocumentCode *string `json:"document_code"`
	AccountCode  *string `json:"account_code"`
	Title        *string `json:"title"`
}

type apiResultsSuccess struct {
	DocumentCode *string `json:"document_code"`
	Title        *string `json:"title"`
	Content      *string `json:"content"`
}
