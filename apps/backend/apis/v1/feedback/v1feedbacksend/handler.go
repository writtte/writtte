package v1feedbacksend

import (
	"net/http"

	"backend/helpers/parseparams"
	"backend/helpers/response"
	"backend/helpers/validate"
	"backend/pkg/intstr"
)

type handler struct {
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) { // revive:disable-line
	var body BodyParams
	if err := parseparams.Body(r, &body); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Body(w, r, body) {
		return
	}

	sendFeedbackEmail(r, &body)

	response.Results(w, r, http.StatusOK, nil)
}
