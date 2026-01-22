package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/aigenerate/v1aigeneratestreaming"
	"backend/apis/v1/authentication/v1signin"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func AIGenerate(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/ai-generate"

	aiGeneratePost(mux, &basePrefix)
}

func aiGeneratePost(mux *http.ServeMux, prefix *string) {
	var (
		streamingPath = "/streaming"
	)

	flows := []middleware.Flow{
		{
			Handler: v1aigeneratestreaming.Setup(),
			Path:    &streamingPath,
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
