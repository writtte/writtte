package routes

import (
	"net/http"

	"backend/routes/sharedroutes"
)

func Shared(mux *http.ServeMux) {
	baseVersion := "/v1"
	sharedroutes.DocumentSharing(mux, &baseVersion)
	sharedroutes.SetNotFound(mux)
}
