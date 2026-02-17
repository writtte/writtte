package v1documentsharingviewretrievelist

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
	case constants.SharingViewRetrievedList:
		// revive:disable:line-length-limit

		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			PageCode:       results.Data.PageCode,
			DateRange:      results.Data.DateRange,
			StartDate:      results.Data.StartDate,
			EndDate:        results.Data.EndDate,
			DailyAnalytics: constructDailyAnalytics(results.Data.DailyAnalytics),
		})

		// revive:enable:line-length-limit

		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}

func constructDailyAnalytics(dbDailyAnalytics []*dbQueryOutputDataDailyItem,
) []*apiResultsDailyItem {
	const placeholder = 0
	dailyItems := make([]*apiResultsDailyItem,
		placeholder, len(dbDailyAnalytics))

	for _, item := range dbDailyAnalytics {
		dailyItems = append(dailyItems, &apiResultsDailyItem{
			Date:        item.Date,
			Views:       item.Views,
			UniqueViews: item.UniqueViews,
		})
	}

	return dailyItems
}
