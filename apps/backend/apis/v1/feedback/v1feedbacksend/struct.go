package v1feedbacksend

// revive:disable:line-length-limit

type BodyParams struct {
	EmailAddress *string `json:"email_address" validate:"required,email"`
	Type         *string `json:"type" validate:"required,oneof=bug feature feedback"`
	Message      *string `json:"message" validate:"required,min=1,max=10000"`
}

// revive:enable:line-length-limit
