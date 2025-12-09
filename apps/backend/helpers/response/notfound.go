package response

import (
	"encoding/json"
	"net/http"

	"backend/cmd/app"
	"backend/constants"
	"backend/pkg/intstr"
)

func NotFoundError(w http.ResponseWriter, r *http.Request,
	httpStatus int, result any) {
	wrappedError, err := wrapNotFoundError(httpStatus, result)
	if err != nil {
		Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	defer closeConnection(w)

	write(w, r, httpStatus, wrappedError)
	dumpNotFoundErrorLog(httpStatus, result, err)
}

func wrapNotFoundError(httpStatus int,
	errorResult any) ([]byte, error) {
	return json.Marshal(map[string]any{
		constants.ResponseStatus: false,
		constants.ResponseCode:   httpStatus,
		constants.ResponseError:  errorResult,
	})
}

func dumpNotFoundErrorLog(httpStatus int,
	results any, errMsg any) {
	jsonContent := map[string]any{
		constants.LogError:      &errMsg,
		constants.LogAdditional: &results,
		constants.LogHTTPStatus: &httpStatus,
	}

	app.Config.Logger.Success(jsonContent,
		constants.FailedErrorRequest)
}
