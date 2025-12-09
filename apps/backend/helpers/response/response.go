package response

import (
	"encoding/json"
	"net/http"

	"backend/cmd/app"
	"backend/constants"
	"backend/pkg/intstr"
)

func Results(w http.ResponseWriter, r *http.Request,
	httpStatus int, results any) {
	uniqueID := returnID(w, r)
	if uniqueID == nil {
		return
	}

	wrappedResult, err := wrapResults(uniqueID.(string),
		httpStatus, results)
	if err != nil {
		Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	closeConnection(w)

	write(w, r, httpStatus, wrappedResult)
	dumpResultsLog(uniqueID.(string), httpStatus)
}

func wrapResults(id string, httpStatus int,
	results any) ([]byte, error) {
	return json.Marshal(map[string]any{
		constants.ResponseID:      id,
		constants.ResponseStatus:  true,
		constants.ResponseCode:    httpStatus,
		constants.ResponseResults: results,
	})
}

func dumpResultsLog(id string, httpStatus int) {
	jsonContent := map[string]any{
		constants.LogID:         &id,
		constants.LogHTTPStatus: &httpStatus,
	}

	app.Config.Logger.Success(jsonContent,
		constants.SuccessResultsRequest)
}
