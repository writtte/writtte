package v1s3presignedurl

import (
	"errors"
	"net/http"

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

	if err := validateBodyParamCombinations(&body); err != nil {
		response.Error(w, r, http.StatusBadRequest, err)
		return
	}

	presignedURL, publicAccessURL, err := h.serv.perform(ctx, &body)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	response.Results(w, r, http.StatusOK, &apiResultsSuccess{
		GeneratedURL:  presignedURL,
		ItemPublicURL: publicAccessURL,
	})
}

func validateBodyParamCombinations(body *BodyParams) error {
	if *body.Type == typeDocumentImage &&
		(body.DocumentCode == nil || body.ImageCode == nil ||
			body.ImageExtension == nil) {
		return errors.New("document code and image extension are required")
	}

	return nil
}
