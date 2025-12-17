package v1subscriptionretrieve

import (
	"net/http"

	"backend/constants"
	"backend/helpers/response"
	"backend/pkg/intstr"
)

type handler struct {
	serv service
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	results, err := h.serv.perform(ctx)
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
	case constants.SubscriptionRetrieved:
		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			CustomerID:  results.Data.CustomerID,
			SeatCount:   results.Data.SeatCount,
			Service:     results.Data.Service,
			ServiceData: results.Data.ServiceData,
			Status:      results.Data.Status,
		})

		return

	case constants.SubscriptionNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
