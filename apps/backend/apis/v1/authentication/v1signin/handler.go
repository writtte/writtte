package v1signin

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
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Body(w, r, body) {
		return
	}

	results, tokens, err := h.serv.perform(ctx, &body)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	checkResponse(w, r, results, tokens)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	results *dbQueryOutput, tokens *apiResultsSuccess) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.UserDynamicPasswordValid:
		response.Results(w, r, http.StatusOK, tokens)
		return

	case constants.UserDynamicPasswordInvalid:
		response.Error(w, r, http.StatusNoContent, nil)
		return

	case constants.UserNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
