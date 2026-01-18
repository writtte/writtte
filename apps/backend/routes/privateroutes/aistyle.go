package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/aistyle/v1aistylecreate"
	"backend/apis/v1/aistyle/v1aistyleretrieve"
	"backend/apis/v1/aistyle/v1aistyleretrievelist"
	"backend/apis/v1/aistyle/v1aistyleupdate"
	"backend/apis/v1/authentication/v1signin"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func AIStyle(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/ai-style"

	aiStyleGet(mux, &basePrefix)
	aiStylePost(mux, &basePrefix)
	aiStylePut(mux, &basePrefix)
}

func aiStyleGet(mux *http.ServeMux, prefix *string) {
	var (
		aiStylePath     = ""
		aiStyleListPath = "/list"
	)

	flows := []middleware.Flow{
		{
			Handler: v1aistyleretrieve.Setup(),
			Path:    &aiStylePath,
			Method:  http.MethodGet,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
				Window:   middleware.Window1,
				TTL:      middleware.TTLDefault,
			},
			JWTSecretKey: &configs.JWTAuthSecret,
			JWTRequiredClaims: &[]string{
				v1signin.ClaimAccountCode,
			},
		},
		{
			Handler: v1aistyleretrievelist.Setup(),
			Path:    &aiStyleListPath,
			Method:  http.MethodGet,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
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

func aiStylePost(mux *http.ServeMux, prefix *string) {
	var (
		aiStylePath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1aistylecreate.Setup(),
			Path:    &aiStylePath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
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

func aiStylePut(mux *http.ServeMux, prefix *string) {
	var (
		aiStylePath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1aistyleupdate.Setup(),
			Path:    &aiStylePath,
			Method:  http.MethodPut,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit2,
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
