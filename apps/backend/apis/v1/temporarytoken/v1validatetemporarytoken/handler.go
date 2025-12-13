package v1validatetemporarytoken

import (
	"net/http"

	"backend/constants"
	"backend/helpers/parse"
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
	if err := parse.Body(r, &body); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Body(w, r, body) {
		return
	}

	results, err := h.serv.perform(ctx, &body)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	checkResponse(w, r, results)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	results *dbQueryOutput) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.TemporaryTokenUsed:
		response.Results(w, r, http.StatusOK, nil)
		return

	case constants.TemporaryTokenExpired:
		response.Error(w, r, http.StatusConflict, nil)
		return

	case constants.TemporaryTokenNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
	}
}
