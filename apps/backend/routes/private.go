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
	privateroutes.Document(mux, &baseVersion)
	privateroutes.DocumentVersion(mux, &baseVersion)
	privateroutes.DocumentSharing(mux, &baseVersion)
	privateroutes.DocumentSharingView(mux, &baseVersion)
	privateroutes.Subscription(mux, &baseVersion)
	privateroutes.Credit(mux, &baseVersion)
	privateroutes.AIStyle(mux, &baseVersion)
	privateroutes.AIGenerate(mux, &baseVersion)
	privateroutes.Webhook(mux, &baseVersion)
	privateroutes.External(mux, &baseVersion)
}
