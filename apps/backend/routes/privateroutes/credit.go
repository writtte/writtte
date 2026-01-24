package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/credits/v1creditretrieve"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func Credit(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/credit"

	creditGet(mux, &basePrefix)
}

func creditGet(mux *http.ServeMux, prefix *string) {
	var (
		creditPath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1creditretrieve.Setup(),
			Path:    &creditPath,
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
