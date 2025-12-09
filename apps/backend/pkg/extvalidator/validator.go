package extvalidator

import "github.com/go-playground/validator/v10"

func Init() *validator.Validate {
	validate := validator.New(validator.WithRequiredStructEnabled())

	return validate
}
