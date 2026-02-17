package v1aistyleretrievelist

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
	case constants.AIStyleRetrievedList:
		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			Total:  results.Data.Total,
			Limit:  results.Data.Limit,
			Offset: results.Data.Offset,
			Items:  constructStyleList(results.Data.Items),
		})

		return

	case constants.UserNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}

func constructStyleList(dbStyleList []*dbQueryOutputDataItem,
) []*apiResultsItem {
	const placeholder = 0
	styleItems := make([]*apiResultsItem,
		placeholder, len(dbStyleList))

	for _, item := range dbStyleList {
		styleItems = append(styleItems, &apiResultsItem{
			AccountCode: item.AccountCode,
			StyleCode:   item.StyleCode,
			Name:        item.Name,
			Style:       item.Style,
			CreatedTime: item.CreatedTime,
			UpdatedTime: item.UpdatedTime,
		})
	}

	return styleItems
}
