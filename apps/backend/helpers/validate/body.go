package validate

import (
	"net/http"

	"backend/cmd/app"
	"backend/cmd/glob"
	"backend/helpers/response"
	"backend/pkg/intstr"
)

func Body(w http.ResponseWriter, r *http.Request, params any) bool {
	if err := glob.Config.Validator.Struct(params); err != nil {
		var errStr *string
		if glob.Config.Environment == app.ProductionEnv {
			errStr = nil
		} else {
			errStr = intstr.StrPtr(err.Error())
		}

		response.Error(w, r, http.StatusBadRequest, errStr)
		return false
	}

	return true
}
