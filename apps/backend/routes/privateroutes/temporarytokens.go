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

	temporaryTokenGet(mux, &basePrefix)
	temporaryTokenPost(mux, &basePrefix)
}

func temporaryTokenGet(mux *http.ServeMux, prefix *string) {
	var (
		tokenPath = "/token"
	)

	flows := []middleware.Flow{
		{
			Handler: v1generatetemporarytoken.Setup(),
			Path:    &tokenPath,
			Method:  http.MethodGet,
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

func temporaryTokenPost(mux *http.ServeMux, prefix *string) {
	var (
		tokenPath = "/token"
	)

	flows := []middleware.Flow{
		{
			Handler: v1validatetemporarytoken.Setup(),
			Path:    &tokenPath,
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
