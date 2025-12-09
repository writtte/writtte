package response

import (
	"encoding/json"
	"net/http"

	"backend/cmd/app"
	"backend/constants"
	"backend/pkg/intstr"
)

func Error(w http.ResponseWriter, r *http.Request,
	httpStatus int, result any) {
	uniqueID := returnID(w, r)
	if uniqueID == nil {
		return
	}

	wrappedError, err := wrapError(uniqueID.(string), httpStatus, result)
	if err != nil {
		Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	defer closeConnection(w)

	write(w, r, httpStatus, wrappedError)
	dumpErrorLog(uniqueID.(string), httpStatus, result, err)
}

func wrapError(id string, httpStatus int,
	errorResult any) ([]byte, error) {
	return json.Marshal(map[string]any{
		constants.ResponseID:     id,
		constants.ResponseStatus: false,
		constants.ResponseCode:   httpStatus,
		constants.ResponseError:  errorResult,
	})
}

func dumpErrorLog(id string, httpStatus int,
	results any, errMsg any) {
	jsonContent := map[string]any{
		constants.LogID:         &id,
		constants.LogError:      &errMsg,
		constants.LogAdditional: &results,
		constants.LogHTTPStatus: &httpStatus,
	}

	app.Config.Logger.Success(jsonContent,
		constants.FailedErrorRequest)
}
