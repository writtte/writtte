package v1userupdate

// revive:disable:line-length-limit

type BodyParams struct {
	EmailAddress    *string `json:"email_address" validate:"omitempty,email"`
	Name            *string `json:"name" validate:"omitempty,min=2,max=256"`
	Password        *string `json:"password" validate:"omitempty,min=8,max=256"`
	Status          *string `json:"status" validate:"omitempty,oneof=pending-deletion"`
	IsEmailVerified *bool   `json:"is_email_verified" validate:"omitempty,boolean"`
}

// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode     *string
	EmailAddress    *string
	Name            *string
	HashedPassword  *string
	PasswordSalt    *string
	Status          *string
	IsEmailVerified *bool
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
