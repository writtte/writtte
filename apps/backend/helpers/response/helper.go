package response

import (
	"net/http"

	"backend/constants"
	"backend/pkg/intstr"
)

func write(w http.ResponseWriter, r *http.Request,
	httpStatus int, resultInBytes []byte) {
	if w == nil {
		Internal(w, r, nil, intstr.StrPtr(constants.ErrorInternalNilResWriter))
		return
	}

	setJSONHeader(w, httpStatus)
	if httpStatus == http.StatusNoContent {
		return
	}

	if err := writeResult(w, resultInBytes); err != nil {
		Internal(w, r, nil, intstr.StrPtr(err.Error()))
	}
}

func writeResult(w http.ResponseWriter, results []byte) error {
	_, err := w.Write(results)
	if err != nil {
		return err
	}

	return nil
}

func setJSONHeader(w http.ResponseWriter, httpStatus int) {
	if w == nil {
		return
	}

	const (
		header      = "Content-Type"
		headerValue = "application/json"
	)

	if rw, ok := w.(interface{ Written() bool }); ok {
		if rw.Written() {
			return
		}
	}

	w.Header().Set(header, headerValue)
	w.WriteHeader(httpStatus)
}

func closeConnection(w http.ResponseWriter) {
	const (
		header      = "Connection"
		headerValue = "close"
	)

	w.Header().Set(header, headerValue)
}

func returnID(w http.ResponseWriter, r *http.Request) any {
	getUniqueID, ok := r.Context().Value(constants.UniqueID).(string)
	if !ok {
		Internal(w, r, nil, intstr.StrPtr(constants.ErrorMiddlewareUIDNotFound))
		return nil
	}

	return getUniqueID
}

func returnIDWithoutChecking(r *http.Request) string {
	getUniqueID, ok := r.Context().Value(constants.UniqueID).(string)
	if !ok {
		return string("")
	}

	return getUniqueID
}
