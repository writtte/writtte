package v1documentversionretrieve

type QueryParams struct {
	DocumentCode *string `json:"document_code" validate:"required,uuid4"`
	VersionCode  *string `json:"version_code" validate:"required,uuid4"`
}

type apiResultsSuccess struct {
	Content *string `json:"content"`
}
