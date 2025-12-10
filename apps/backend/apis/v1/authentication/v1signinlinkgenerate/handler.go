package v1signinlinkgenerate

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

	var body BodyParams
	if err := parse.Body(r, &body); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Body(w, r, body) {
		return
	}

	results, tokens, err := h.serv.perform(ctx, &body)
	if err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	checkResponse(w, r, &body, results, tokens)
}

func checkResponse(w http.ResponseWriter, r *http.Request,
	body *BodyParams, results *dbQueryOutput, tokens *serviceResults) {
	if !*results.Status {
		response.Internal(w, r, results, results.Message)
		return
	}

	switch *results.Code {
	case constants.UserRetrieved:
		generatedLink := sendSignInLink(r, body.EmailAddress,
			results.Data.Name, results.Data.AccountCode, tokens.AccessToken,
			tokens.RefreshToken)

		if glob.Config.Environment != flags.ProductionEnv {
			response.Results(w, r, http.StatusOK, apiResultsSuccess{
				GeneratedLink: generatedLink,
			})

			return
		}

		response.Results(w, r, http.StatusOK, nil)
		return

	case constants.UserNotExists:
		response.Error(w, r, http.StatusNotFound, nil)
		return

	default:
		response.Internal(w, r, results, nil)
		return
	}
}
