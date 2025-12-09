package response

import (
	"encoding/json"
	"net/http"
	"runtime"
	"runtime/debug"
	"time"

	"github.com/getsentry/sentry-go"

	"backend/cmd/glob"
	"backend/constants"
)

func Internal(w http.ResponseWriter, r *http.Request,
	result any, errMsg *string) {
	const httpStatus = http.StatusInternalServerError

	const callerSkip = 1
	pc, file, line, ok := runtime.Caller(callerSkip)
	var funcName string
	if ok {
		funcName = runtime.FuncForPC(pc).Name()
	}

	setJSONHeader(w, httpStatus)

	getUniqueID := returnIDWithoutChecking(r)
	stackTrace := getStackTrace()
	wrappedError, err := wrapInternalError(getUniqueID, errMsg)
	if err != nil {
		dumpInternalLog(r, getUniqueID, result, err.Error(),
			file, funcName, line, stackTrace)
		http.Error(w, err.Error(), httpStatus)
	}

	defer closeConnection(w)

	_, err = w.Write(wrappedError)
	if err != nil {
		dumpInternalLog(r, getUniqueID, result, err.Error(),
			file, funcName, line, stackTrace)
		http.Error(w, err.Error(), httpStatus)
	}

	dumpInternalLog(r, getUniqueID, result, errMsg,
		file, funcName, line, stackTrace)
}

func getStackTrace() string {
	return string(debug.Stack())
}

func wrapInternalError(id string,
	errResults *string) ([]byte, error) {
	return json.Marshal(map[string]any{
		constants.ResponseID:     id,
		constants.ResponseStatus: false,
		constants.ResponseCode:   http.StatusInternalServerError,
		constants.ResponseError:  errResults,
	})
}

func dumpInternalLog(r *http.Request, id string, results any, errMsg any,
	file, funcName string, line int, stackTrace string) {
	jsonContent := map[string]any{
		constants.LogID:         &id,
		constants.LogError:      &errMsg,
		constants.LogAdditional: &results,
		constants.LogHTTPStatus: http.StatusInternalServerError,
		constants.LogTrace:      &stackTrace,
		constants.LogDetails: map[string]any{
			constants.CallURL:      &r.URL.Path,
			constants.CallIP:       &r.RemoteAddr,
			constants.CallMethod:   &r.Method,
			constants.CallTLS:      r.TLS,
			constants.CallProtocol: &r.Proto,
			constants.LogFunction:  funcName,
			constants.LogFile:      file,
			constants.LogLine:      line,
		},
	}

	glob.Config.Logger.Success(jsonContent,
		constants.InternalErrorRequest)

	sentry.CaptureMessage(stackTrace)
	sentry.Flush(2 * time.Second)
}
