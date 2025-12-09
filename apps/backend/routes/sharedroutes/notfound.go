package sharedroutes

import (
	"net/http"

	"backend/apis/v1/common/v1notfound"
)

func SetNotFound(mux *http.ServeMux) {
	mux.HandleFunc("/", v1notfound.Setup)
}
