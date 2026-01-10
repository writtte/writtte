package v1folderretrievelist

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
	case constants.FolderRetrievedList:
		const placeholder = 0

		folders := make([]*apiResultsSuccessFolders, placeholder)
		for _, folder := range results.Data.Folders {
			folders = append(folders, &apiResultsSuccessFolders{
				FolderCode:  folder.FolderCode,
				AccountCode: folder.AccountCode,
				Title:       folder.Title,
				CreatedTime: folder.CreatedTime,
				UpdatedTime: folder.UpdatedTime,
			})
		}

		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			Folders: folders,
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
