package connect

import (
	"backend/cmd/glob"
	"backend/constants"
	"backend/routes"
	"errors"
	"net/http"
)

func Routes() {
	mux, ok := glob.Config.HTTPHandler.(*http.ServeMux)
	if !ok {
		panic(errors.New(constants.ErrorInvalidTypeServerMux))
	}

	routes.Shared(mux)
	routes.Private(mux)
}
