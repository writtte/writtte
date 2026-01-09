package v1documentsharingretrievelist

type QueryParams struct {
	DocumentCode *string `json:"document_code" validate:"required,uuid4"`
}

type dbQueryInput struct {
	AccountCode  *string
	DocumentCode *string
}

type dbQueryOutputDataSharingItem struct {
	AccountCode  *string `json:"account_code"`
	DocumentCode *string `json:"document_code"`
	SharingCode  *string `json:"sharing_code"`
	CreatedTime  *string `json:"created_time"`
}

type dbQueryOutputData struct {
	SharingList []*dbQueryOutputDataSharingItem `json:"sharing_list"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSharingItem struct {
	AccountCode  *string `json:"account_code"`
	DocumentCode *string `json:"document_code"`
	SharingCode  *string `json:"sharing_code"`
	CreatedTime  *string `json:"created_time"`
}

type apiResultsSuccess struct {
	SharingList []*apiResultsSharingItem `json:"sharing_list"`
}
