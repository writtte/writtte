package middleware

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"backend/cmd/glob"
	"backend/constants"
	"backend/helpers/response"
	"backend/pkg/extjwt"
)

func AuthenticateJWT(next http.Handler, secretKey string,
	requiredClaims *[]string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authContext, status, err := getAuthContext(r, secretKey)
		if err != nil {
			response.Error(w, r, status, map[string]any{
				constants.ResponseError: err.Error(),
			})

			return
		}

		validateRequiredClaims(authContext, w, r, requiredClaims)
		next.ServeHTTP(w, r.WithContext(authContext))
	})
}

func getAuthContext(r *http.Request,
	secretKey string) (context.Context, int, error) {
	const (
		minHeaderLength = 7
	)

	uniqueID, ok := r.Context().Value(constants.UniqueID).(string)
	if !ok {
		uniqueID = ""
	}

	parseHeader, err := validateAuthHeader(r)
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	parseToken := parseHeader[minHeaderLength:]
	decodedSecretKey, err := extjwt.DecodeSecretKey(secretKey)
	if err != nil {
		return nil, http.StatusUnauthorized,
			errors.New(constants.ErrorMiddlewareJWTInvalidToken)
	}

	jwtToken, err := extjwt.ParseJWT(decodedSecretKey, parseToken)
	if err != nil || !jwtToken.Valid {
		logInvalidTokenError(uniqueID, err)
		return nil, http.StatusUnauthorized,
			errors.New(constants.ErrorMiddlewareJWTInvalidToken)
	}

	return returnClaimsToContext(r, jwtToken)
}

func validateAuthHeader(r *http.Request) (string, error) {
	const (
		requiredHeader  = "Authorization"
		minHeaderLength = 7
		requiredPrefix  = "Bearer "
		emptyStr        = ""
	)

	parseHeader := r.Header.Get(requiredHeader)
	if parseHeader == emptyStr {
		return emptyStr, errors.New(constants.ErrorMiddlewareJWTNoAuthHeader)
	}

	if len(parseHeader) <= minHeaderLength ||
		parseHeader[:minHeaderLength] != requiredPrefix {
		return emptyStr, errors.New(constants.ErrorMiddlewareNoBearer)
	}

	return parseHeader, nil
}

func logInvalidTokenError(uniqueID string, err error) {
	if err != nil {
		glob.Config.Logger.Error(map[string]any{
			constants.LogID:    uniqueID,
			constants.LogError: err.Error(),
		}, errors.New(constants.ErrorMiddlewareJWTInvalidToken))
	}
}

func returnClaimsToContext(r *http.Request,
	token *extjwt.JWTToken) (context.Context, int, error) {
	if token.Claims == nil {
		return nil, http.StatusUnauthorized,
			errors.New(constants.ErrorMiddlewareJWTInvalidToken)
	}

	if claims, ok := token.Claims.(extjwt.MapClaims); ok {
		return context.WithValue(r.Context(), constants.JWTKey, claims),
			http.StatusUnauthorized, nil
	}

	const ignore = -1
	return nil, ignore, errors.New(constants.ErrorMiddlewareJWTInvalidToken)
}

func validateRequiredClaims(authContext context.Context,
	w http.ResponseWriter, r *http.Request, requiredClaims *[]string) {
	const minLength = 0
	if len(*requiredClaims) == minLength {
		return
	}

	claims, ok := authContext.Value(constants.JWTKey).(extjwt.MapClaims)
	if !ok {
		sendUnauthorizedError(w, r, constants.ErrorMiddlewareJWTClaimsInvalid)
		return
	}

	for _, claim := range *requiredClaims {
		if _, ok := claims[claim]; !ok {
			sendUnauthorizedError(w, r, fmt.Sprintf("%s: %s",
				constants.ErrorMiddlewareJWTClaimNotFound, claim))
			return
		}
	}
}

func sendUnauthorizedError(w http.ResponseWriter, r *http.Request,
	errorMsg string) {
	response.Error(w, r, http.StatusUnauthorized, map[string]any{
		constants.ResponseError: errorMsg,
	})
}
