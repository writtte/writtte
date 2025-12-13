package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/authentication/v1signinlinkgenerate"
	"backend/apis/v1/authentication/v1signupcreate"
	"backend/cmd/glob"
	"backend/constants"
	"backend/middleware"
)

func Authentication(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/authentication"

	authenticationPost(mux, &basePrefix)
}

func authenticationPost(mux *http.ServeMux, prefix *string) {
	var (
		signUpPath     = "/sign-up"
		signInPath     = "/sign-in"
		signInLinkPath = "/sign-in/link"
	)

	flows := []middleware.Flow{
		{
			Handler: v1signupcreate.Setup(),
			Path:    &signUpPath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit1,
				Window:   middleware.Window5,
				TTL:      middleware.TTLDefault,
			},
		},
		{
			Handler: v1signin.Setup(),
			Path:    &signInPath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
				Window:   middleware.Window1,
				TTL:      middleware.TTLDefault,
			},
		},
		{
			Handler: v1signinlinkgenerate.Setup(),
			Path:    &signInLinkPath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit1,
				Window:   middleware.Window1,
				TTL:      middleware.TTLDefault,
			},
		},
	}

	for _, flow := range flows {
		glob.Config.Logger.Information(map[string]any{
			constants.CallMethod: flow.Method,
			constants.CallPath:   *prefix + *flow.Path,
		}, constants.APIRoutePostInitialized)

		*flow.Path = fmt.Sprintf("%s %s%s", flow.Method, // revive:disable-line
			*prefix, *flow.Path)
		mux.Handle(*flow.Path, middleware.Apply(flow))
	}
}
