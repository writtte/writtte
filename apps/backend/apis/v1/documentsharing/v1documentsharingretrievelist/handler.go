package v1documentsharingretrievelist

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
	case constants.DocumentSharingRetrievedList:
		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			SharingList: constructSharingList(results.Data.SharingList),
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

func constructSharingList(dbSharingList []*dbQueryOutputDataSharingItem,
) []*apiResultsSharingItem {
	const placeholder = 0
	sharingItems := make([]*apiResultsSharingItem,
		placeholder, len(dbSharingList))

	for _, item := range dbSharingList {
		sharingItems = append(sharingItems, &apiResultsSharingItem{
			AccountCode:  item.AccountCode,
			DocumentCode: item.DocumentCode,
			SharingCode:  item.SharingCode,
			CreatedTime:  item.CreatedTime,
		})
	}

	return sharingItems
}
