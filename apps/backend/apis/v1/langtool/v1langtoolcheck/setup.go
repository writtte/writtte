package v1langtoolcheck

import (
	"net/http"
)

func Setup() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		serviceInstance := newService()
		handlerInstance := &handler{serv: serviceInstance}

		handlerInstance.perform(w, r)
	}
}
