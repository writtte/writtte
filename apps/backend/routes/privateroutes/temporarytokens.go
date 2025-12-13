package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/temporarytoken/v1generatetemporarytoken"
	"backend/apis/v1/temporarytoken/v1validatetemporarytoken"
	"backend/cmd/glob"
	"backend/constants"
	"backend/middleware"
)

func TemporaryTokens(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/temporary"

	temporaryTokenPost(mux, &basePrefix)
}

func temporaryTokenPost(mux *http.ServeMux, prefix *string) {
	var (
		tokenGeneratePath = "/token/generate"
		tokenValidatePath = "/token/validate"
	)

	flows := []middleware.Flow{
		{
			Handler: v1generatetemporarytoken.Setup(),
			Path:    &tokenGeneratePath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
				Window:   middleware.Window1,
				TTL:      middleware.TTLDefault,
			},
		},
		{
			Handler: v1validatetemporarytoken.Setup(),
			Path:    &tokenValidatePath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
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
