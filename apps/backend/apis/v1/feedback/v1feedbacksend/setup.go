package v1feedbacksend

import (
	"net/http"
)

func Setup() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handlerInstance := &handler{}

		handlerInstance.perform(w, r)
	}
}
