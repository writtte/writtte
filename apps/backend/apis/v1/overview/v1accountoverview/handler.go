package v1accountoverview

import (
	"net/http"
	"strings"

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

// revive:disable:cognitive-complexity

func checkResponse(w http.ResponseWriter, r *http.Request,
	results *dbQueryOutput) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.OverviewAccountRetrieved:
		// revive:disabled:line-length-limit

		var statusStr string
		var subscriptionStatusStr string

		status := results.Data.User.Status
		if status != nil {
			statusStr = strings.ToLower(*status)
		}

		subscriptionStatus := results.Data.Subscription.Status
		if subscriptionStatus != nil {
			subscriptionStatusStr = strings.ToLower(*subscriptionStatus)
		}

		mappedResults := &apiResultsSuccess{
			AccountCode:        results.Data.User.AccountCode,
			EmailAddress:       results.Data.User.EmailAddress,
			Name:               results.Data.User.Name,
			Status:             &statusStr,
			SubscriptionStatus: &subscriptionStatusStr,
			IsEmailVerified:    results.Data.User.IsEmailVerified,
			UpdatedTime:        results.Data.User.UpdatedTime,
		}

		if subscriptionStatusStr == "no_subscription" &&
			results.Data.User.CreatedTime != nil {
			calculatedDays :=
				calculateFreeTrialDays(results.Data.User.CreatedTime)

			mappedResults.AvailableFreeTrialDates = &calculatedDays
		}

		response.Results(w, r, http.StatusOK, mappedResults)

		// revive:enable:line-length-limit

		return

	case constants.UserNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}

// revive:enable:cognitive-complexity
