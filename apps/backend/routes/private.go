package routes

import (
	"net/http"

	"backend/routes/privateroutes"
)

func Private(mux *http.ServeMux) {
	baseVersion := "/v1"

	privateroutes.TemporaryTokens(mux, &baseVersion)
	privateroutes.Authentication(mux, &baseVersion)
	privateroutes.Overview(mux, &baseVersion)
}
