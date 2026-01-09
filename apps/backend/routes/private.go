package routes

import (
	"net/http"

	"backend/routes/privateroutes"
)

func Private(mux *http.ServeMux) {
	baseVersion := "/v1"

	privateroutes.TemporaryTokens(mux, &baseVersion)
	privateroutes.Authentication(mux, &baseVersion)
	privateroutes.User(mux, &baseVersion)
	privateroutes.Overview(mux, &baseVersion)
	privateroutes.Item(mux, &baseVersion)
	privateroutes.Folder(mux, &baseVersion)
	privateroutes.Tree(mux, &baseVersion)
	privateroutes.DocumentSharing(mux, &baseVersion)
	privateroutes.Subscription(mux, &baseVersion)
	privateroutes.Webhook(mux, &baseVersion)
	privateroutes.External(mux, &baseVersion)
}
