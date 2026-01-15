package routes

import (
	"net/http"

	"backend/routes/publicroutes"
)

func Public(mux *http.ServeMux) {
	baseVersion := "/v1/public"

	publicroutes.DocumentSharing(mux, &baseVersion)
	publicroutes.DocumentSharingView(mux, &baseVersion)
}
