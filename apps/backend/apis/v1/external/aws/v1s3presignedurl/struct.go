package v1s3presignedurl

// revive:disable:line-length-limit

type BodyParams struct {
	Bucket *string `json:"bucket" validate:"required,oneof=private"`
	Type   *string `json:"type" validate:"required,oneof=document-image"`
	Action *string `json:"action" validate:"required,oneof=get put delete"`

	// Flow specific details

	DocumentCode   *string `json:"document_code" validate:"omitempty,uuid"`
	ImageCode      *string `json:"image_code" validate:"omitempty,uuid"`
	ImageExtension *string `json:"image_extension" validate:"omitempty,min=1,max=8"`
}

// revive:enable:line-length-limit

type dbQueryOutputForImageData struct {
	ImageCode *string `json:"image_code"`
}

type dbQueryOutputForImage struct {
	Status     *bool                      `json:"status"`
	Code       *string                    `json:"code"`
	Message    *string                    `json:"message"`
	Additional *string                    `json:"additional"`
	Data       *dbQueryOutputForImageData `json:"data"`
}

type apiResultsSuccess struct {
	GeneratedURL *string `json:"generated_url"`
}
