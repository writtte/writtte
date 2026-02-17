package v1documentversionretrievelist

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
	case constants.VersionRetrievedList:
		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			Versions:   constructVersionList(results.Data.Versions),
			Pagination: constructPagination(results.Data.Pagination),
		})

		return

	case constants.DocumentNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}

func constructVersionList(dbVersionList []*dbQueryOutputDataVersionItem,
) []*apiResultsSuccessVersionItem {
	const placeholder = 0
	versionItems := make([]*apiResultsSuccessVersionItem, placeholder,
		len(dbVersionList))

	for _, item := range dbVersionList {
		versionItems = append(versionItems, &apiResultsSuccessVersionItem{
			VersionCode:  item.VersionCode,
			DocumentCode: item.DocumentCode,
			StoredType:   item.StoredType,
			CreatedTime:  item.CreatedTime,
		})
	}

	return versionItems
}

func constructPagination(dbPagination *dbQueryOutputDataPagination,
) *apiResultsSuccessPagination {
	return &apiResultsSuccessPagination{
		CurrentPage: dbPagination.CurrentPage,
		PageSize:    dbPagination.PageSize,
		TotalCount:  dbPagination.TotalCount,
		TotalPages:  dbPagination.TotalPages,
	}
}
