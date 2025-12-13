package v1generatetemporarytoken

import (
	"net/http"

	"backend/cmd/flags"
	"backend/cmd/glob"
	"backend/constants"
	"backend/helpers/parse"
	"backend/helpers/response"
	"backend/helpers/validate"
	"backend/pkg/intstr"
)

type handler struct {
	serv service
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var queries QueryParams
	if err := parse.Queries(r, &queries); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Query(w, r, queries) {
		return
	}

	var body BodyParams
	if err := parse.Body(r, &body); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Body(w, r, queries) {
		return
	}

	results, tokenType, err := h.serv.perform(ctx, &queries, &body)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	checkResponse(w, r, &queries, *tokenType, results)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	queries *QueryParams, tokenType TokenType,
	results *dbQueryOutput) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.TemporaryTokenCreated:
		generatedLink := checkEmailSend(r, tokenType, results.Data.Value,
			queries.EmailAddress)

		if generatedLink == nil {
			response.Error(w, r, http.StatusNotAcceptable, nil)
			return
		}

		if glob.Config.Environment != flags.ProductionEnv {
			response.Results(w, r, http.StatusCreated, apiResultsSuccess{
				GeneratedLink:  generatedLink,
				GeneratedCode:  results.Data.Value,
				ExpirationTime: results.Data.ExpirationTime,
			})

			return
		}

		response.Results(w, r, http.StatusCreated, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}

func checkEmailSend(r *http.Request, tokenType TokenType, tokenToSend,
	email *string) *string {
	if email == nil {
		return nil
	}

	if tokenType == TypeSignUpVerify {
		return sendSignUpEmail(r, email, tokenToSend)
	}

	return nil
}
