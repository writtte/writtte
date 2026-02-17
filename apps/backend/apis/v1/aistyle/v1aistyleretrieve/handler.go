package v1aistyleretrieve

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

	var queries QueryParams
	if err := parseparams.Queries(r, &queries); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Query(w, r, queries) {
		return
	}

	results, err := h.serv.perform(ctx, &queries)
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
	case constants.AIStyleRetrieved:
		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			StyleCode:   results.Data.StyleCode,
			Name:        results.Data.Name,
			Style:       results.Data.Style,
			CreatedTime: results.Data.CreatedTime,
			UpdatedTime: results.Data.UpdatedTime,
		})

		return

	case constants.AIStyleNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
