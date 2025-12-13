package v1validatetemporarytoken

// revive:disable:line-length-limit

type BodyParams struct {
	Type  *string `json:"type" validate:"required,oneof=sign-up-verify"`
	Key   *string `json:"key" validate:"required,min=2,max=256"`
	Value *string `json:"value" validate:"required,min=2,max=256"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	Type  *string
	Key   *string
	Value *string
}

type dbQueryOutputData struct {
	Type           *string `json:"type"`
	Key            *string `json:"key"`
	Value          *string `json:"value"`
	Status         *string `json:"status"`
	ExpirationTime *string `json:"expiration_time"`
	CreatedTime    *string `json:"created_time"`
	UpdatedTime    *string `json:"updated_time"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}
