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

	checkResponse(w, r, &queries, &body, *tokenType, results)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	queries *QueryParams, body *BodyParams, tokenType TokenType,
	results *dbQueryOutput) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.TemporaryTokenCreated:
		generatedLink := checkEmailSend(r, body, tokenType, results.Data.Value,
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

func checkEmailSend(r *http.Request, body *BodyParams, tokenType TokenType,
	tokenToSend, email *string) *string {
	if email == nil {
		return nil
	}

	switch tokenType {
	case TypeSignUpVerify:
		return sendSignUpEmail(r, email, tokenToSend)

	case TypeEmailUpdate:
		// revive:disable:line-length-limit

		if body.NewAccountEmailAddress == nil {
			panic("new account email address is required to send the confirmation email")
		}

		// revive:enable:line-length-limit

		return sendEmailUpdateEmail(r, email, tokenToSend,
			body.NewAccountEmailAddress)
	}

	return nil
}
