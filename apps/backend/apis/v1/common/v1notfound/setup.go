package v1notfound

import (
	"net/http"

	"backend/constants"
	"backend/helpers/response"
)

func Setup(w http.ResponseWriter, r *http.Request) {
	response.NotFoundError(w, r, http.StatusNotFound, constants.ErrorNotFound)
}
