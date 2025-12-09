package middleware

import (
	"net/http"

	"backend/cmd/glob"
)

// revive:disable:line-length-limit

type Flow struct {
	Handler           http.HandlerFunc // The main request handler function
	Path              *string          // The URL path for the route
	Method            string           // The HTTP method (GET, POST, etc.)
	Rates             *Rates           // Rate limiting configuration
	JWTSecretKey      *string          // JWT secret key for authentication
	JWTRequiredClaims *[]string        // Required JWT claims
}

// revive:enable:line-length-limit

func Apply(f Flow) http.Handler {
	var handler http.Handler = f.Handler

	if f.JWTSecretKey != nil {
		handler = AuthenticateJWT(handler, *f.JWTSecretKey,
			f.JWTRequiredClaims)
	}

	if f.Rates != nil && glob.Config.RateLimit {
		handler = LimitRate(handler, *f.Rates)
	}

	handler = GenerateLog(handler)
	handler = GenerateUniqueID(handler)
	handler = RecoverPanic(handler)

	return handler
}
