package v1userupdate

import (
	"net/http"

	"backend/cmd/glob"
)

func Setup() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dbInstance := &database{DB: glob.Config.MainSQLDB}
		serviceInstance := &service{repo: dbInstance}
		handlerInstance := &handler{serv: *serviceInstance}

		handlerInstance.perform(w, r)
	}
}
