package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/overview/v1accountoverview"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func Overview(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/overview"

	overviewGet(mux, &basePrefix)
}

func overviewGet(mux *http.ServeMux, prefix *string) {
	var (
		accountPath = "/account"
	)

	flows := []middleware.Flow{
		{
			Handler: v1accountoverview.Setup(),
			Path:    &accountPath,
			Method:  http.MethodGet,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit5,
				Window:   middleware.Window1,
				TTL:      middleware.TTLDefault,
			},
			JWTSecretKey: &configs.JWTAuthSecret,
			JWTRequiredClaims: &[]string{
				v1signin.ClaimAccountCode,
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
