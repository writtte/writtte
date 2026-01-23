package v1aigeneratestreaming

// revive:disable:line-length-limit

type BodyParams struct {
	Message   *string `json:"message" validate:"required,max=10240"`
	StyleCode *string `json:"style_code" validate:"omitempty,uuid"`
	Quick     *string `json:"quick" validate:"omitempty,oneof=fix-grammar shorten lengthen summarize simplify"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode      *string
	UsedCreditAmount *int
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}

type sseMessage struct {
	Text         *string
	InputTokens  *int
	OutputTokens *int
	Error        *string
}
