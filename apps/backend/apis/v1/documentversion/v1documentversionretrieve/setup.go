package v1documentversionretrieve

import (
	"net/http"
)

func Setup() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		serviceInstance := &service{}
		handlerInstance := &handler{serv: *serviceInstance}

		handlerInstance.perform(w, r)
	}
}
