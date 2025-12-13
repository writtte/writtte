package v1signin

import "backend/helpers/password"

func validatePassword(raw, hashed, salt *string) bool {
	return password.Validate(*raw, *hashed, *salt)
}
