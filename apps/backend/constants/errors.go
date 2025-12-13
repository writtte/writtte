package constants

// revive:disable:line-length-limit

const (
	ErrorNotFound = "the server cannot find the requested resource"
)

const (
	ErrorInternalNilResWriter = "response writer is nil"
	ErrorInvalidTypeServerMux = "invalid type for http server mux"
)

const (
	ErrorMiddlewareJWTClaimNotFound   = "claim not found"
	ErrorMiddlewareJWTClaimsInvalid   = "invalid claims"
	ErrorMiddlewareJWTEmptyToken      = "empty access token key"
	ErrorMiddlewareJWTInvalidToken    = "inactive or invalid access token"
	ErrorMiddlewareJWTNoAuthHeader    = "no authorization header found in request"
	ErrorMiddlewareNoBearer           = "no bearer found in header"
	ErrorMiddlewareRateLimitExceeded  = "rate limit exceeded"
	ErrorMiddlewareRateLimitInvalidIP = "invalid ip address"
	ErrorMiddlewareUIDNotFound        = "unique id not found in context"
)
