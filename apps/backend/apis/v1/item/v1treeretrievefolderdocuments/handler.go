package v1treeretrievefolderdocuments

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
	case constants.TreeFolderDocumentsRetrieved:
		const placeholder = 0

		documents := make([]*apiResultsSuccessDocuments, placeholder)
		for _, doc := range results.Data.Documents {
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

		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			FolderCode: results.Data.FolderCode,
			Documents:  documents,
			Pagination: &apiResultsSuccessPagination{
				CurrentPage: results.Data.Pagination.CurrentPage,
				PageSize:    results.Data.Pagination.PageSize,
				TotalCount:  results.Data.Pagination.TotalCount,
				TotalPages:  results.Data.Pagination.TotalPages,
			},
		})

		return

	case constants.FolderNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
