package v1creditretrieve

import (
	"net/http"

	"backend/constants"
	"backend/helpers/response"
)

type handler struct {
	serv service
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	results, err := h.serv.perform(ctx)
	if err != nil {
		errMsg := err.Error()
		response.Internal(w, r, nil, &errMsg)
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
	case constants.CreditRetrieved:
		// revive:disable:line-length-limit

		response.Results(w, r, http.StatusOK, &apiResultsSuccess{
			Subscription:      results.Data.Subscription,
			Manual:            results.Data.Manual,
			TotalCreditAmount: formatCreditAmount(results.Data.TotalCreditAmount),
		})

		// revive:enable:line-length-limit

		return

	case constants.CreditNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
