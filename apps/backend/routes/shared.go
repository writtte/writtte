package routes

import (
	"net/http"

	"backend/routes/sharedroutes"
)

func Shared(mux *http.ServeMux) {
	sharedroutes.SetNotFound(mux)
}
