package middleware

import (
	"net/http"

	"backend/cmd/glob"
	"backend/constants"
	"backend/helpers/response"
	"backend/pkg/intstr"
)

func GenerateLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		getID := ReturnUniqueID(w, r)

		generateBegin(r, getID.(string))
		next.ServeHTTP(w, r)
		generateEnd(getID.(string))
	})
}

func generateBegin(r *http.Request, id string) {
	glob.Config.Logger.Information(map[string]any{
		constants.LogID:      &id,
		constants.CallURL:    &r.URL.Path,
		constants.CallIP:     &r.RemoteAddr,
		constants.CallMethod: &r.Method,
		constants.CallTLS:    r.TLS,
	}, constants.RequestLoggingStarting)
}

func generateEnd(id string) {
	glob.Config.Logger.Success(map[string]any{
		constants.LogID: &id,
	}, constants.RequestLoggingSuccess)
}

func ReturnUniqueID(w http.ResponseWriter, r *http.Request) any {
	getUniqueID, ok := r.Context().Value(constants.UniqueID).(string)
	if !ok {
		response.Internal(w, r, nil,
			intstr.StrPtr(constants.ErrorMiddlewareUIDNotFound))

		return nil
	}

	return getUniqueID
}
