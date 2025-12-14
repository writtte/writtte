package v1documentretrieve

import (
	"net/http"

	"backend/constants"
	"backend/helpers/dbconvert"
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

	var queries QueryParams
	if err := parse.Queries(r, &queries); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Query(w, r, queries) {
		return
	}

	results, content, err := h.serv.perform(ctx, &queries)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	checkResponse(w, r, results, content)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	results *dbQueryOutput, content *string) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.DocumentRetrieved:
		// revive:disable:line-length-limit

		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			Title:          results.Data.Title,
			LifecycleState: intstr.StrPtr(dbconvert.ItemLifecycleStateToExport(results.Data.LifecycleState)),
			WorkflowState:  intstr.StrPtr(dbconvert.ItemWorkflowStateToExport(results.Data.WorkflowState)),
			Content:        content,
		})

		// revive:enable:line-length-limit

		return

	case constants.DocumentNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
