package v1documentretrievelist

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

	var queries QueryParams
	if err := parse.Queries(r, &queries); err != nil {
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
	case constants.DocumentRetrievedList:
		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			Documents: constructDocumentList(results.Data.Documents),
			Pagination: &apiResultsSuccessPagination{
				CurrentPage: results.Data.Pagination.CurrentPage,
				PageSize:    results.Data.Pagination.PageSize,
				TotalCount:  results.Data.Pagination.TotalCount,
				TotalPages:  results.Data.Pagination.TotalPages,
			},
		})

		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}

func constructDocumentList(dbDocuments []*dbQueryOutputDataDocuments,
) []*apiResultsSuccessDocuments {
	const placeholder = 0

	documents := make([]*apiResultsSuccessDocuments, placeholder,
		len(dbDocuments))

	for _, doc := range dbDocuments {
		documents = append(documents, &apiResultsSuccessDocuments{
			DocumentCode:   doc.DocumentCode,
			AccountCode:    doc.AccountCode,
			Title:          doc.Title,
			LifecycleState: doc.LifecycleState,
			WorkflowState:  doc.WorkflowState,
			CreatedTime:    doc.CreatedTime,
			UpdatedTime:    doc.UpdatedTime,
		})
	}

	return documents
}
