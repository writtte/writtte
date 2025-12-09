package middleware

import (
	"context"
	"net/http"

	"backend/constants"
	"backend/pkg/extuuid"
)

func GenerateUniqueID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		generatedUID := generateID()
		ctx := setID(r, generatedUID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func setID(r *http.Request, id string) context.Context {
	return context.WithValue(r.Context(), constants.UniqueID, id)
}

func generateID() string {
	return extuuid.Generate()
}
