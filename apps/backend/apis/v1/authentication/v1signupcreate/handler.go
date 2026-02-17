package v1signupcreate

import (
	"net/http"

	"backend/constants"
	"backend/helpers/parseparams"
	"backend/helpers/response"
	"backend/helpers/validate"
	"backend/pkg/intstr"
)

type handler struct {
	serv service
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body BodyParams
	if err := parseparams.Body(r, &body); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr((err.Error())))
		return
	}

	if !validate.Body(w, r, body) {
		return
	}

	results, err := h.serv.perform(ctx, &body)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr((err.Error())))
		return
	}

	checkResponse(w, r, &body, results)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	body *BodyParams, results *dbQueryOutput) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.UserCreated:
		sendSignUpEmail(r, body.EmailAddress, body.Name,
			results.Data.AccountCode)

		response.Results(w, r, http.StatusCreated, nil)
		return

	case constants.UserExists:
		response.Error(w, r, http.StatusConflict, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
