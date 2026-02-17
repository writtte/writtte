package v1documentretrieve

import (
	"net/http"

	"backend/constants"
	"backend/helpers/dbconvert"
	"backend/helpers/parseparams"
	"backend/helpers/response"
	"backend/helpers/validate"
	"backend/pkg/intstr"
)

type handler struct {
	serv service
}

// revive:disable:cognitive-complexity

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	ifNoneMatch := r.Header.Get("if-none-match")

	var queries QueryParams
	if err := parseparams.Queries(r, &queries); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Query(w, r, queries) {
		return
	}

	if ifNoneMatch != "" {
		eTag, err := h.serv.performETag(ctx, &queries)
		if err != nil {
			response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
			return
		}

		if eTag != nil && *eTag == ifNoneMatch {
			response.Results(w, r, http.StatusNotModified, nil)
			return
		}

		// In this case, the content should be returned, so continue to
		// the fucking section below...
	}

	results, content, err := h.serv.perform(ctx, &queries)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	checkResponse(w, r, results, content)
}

// revive:enable:cognitive-complexity

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
