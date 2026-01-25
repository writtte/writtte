package v1langtoolcheck

import (
	"fmt"
	"net/http"

	"backend/helpers/response"
	"backend/pkg/intstr"
)

type handler struct {
	serv languageToolService
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	requestData, err := parseFormData(r)
	if err != nil {
		response.Internal(w, r, nil,
			intstr.StrPtr("failed to parse form data: "+err.Error()))

		return
	}

	if err := validateRequiredFields(requestData); err != nil {
		response.Error(w, r, http.StatusBadRequest, intstr.StrPtr(err.Error()))
		return
	}

	result, err := h.serv.checkText(ctx, requestData)
	if err != nil {
		response.Internal(w, r, nil,
			intstr.StrPtr("language tool check failed: "+err.Error()))

		return
	}

	response.Results(w, r, http.StatusOK, result)
}

func parseFormData(r *http.Request) (map[string]any, error) {
	if err := r.ParseForm(); err != nil {
		return nil, err
	}

	const zero = 0

	requestData := make(map[string]any)
	for key, values := range r.Form {
		if len(values) > zero {
			requestData[key] = values[zero]
		}
	}

	return requestData, nil
}

func validateRequiredFields(data map[string]any) error {
	requiredFields := []string{"text", "language"}

	for _, field := range requiredFields {
		value, ok := data[field]
		if !ok || value == "" {
			return fmt.Errorf("%s field is required", field)
		}
	}

	return nil
}
