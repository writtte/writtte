package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/external/aws/v1s3presignedurl"
	"backend/apis/v1/external/polar/v1checkoutsessionlink"
	"backend/apis/v1/external/polar/v1customerportallink"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func External(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/external"

	externalGet(mux, &basePrefix)
	externalPost(mux, &basePrefix)
}

func externalGet(mux *http.ServeMux, prefix *string) {
	var (
		checkoutLinkPath = "/payment-link/checkout"
		portalLinkPath   = "/payment-link/portal"
	)

	flows := []middleware.Flow{
		{
			Handler: v1checkoutsessionlink.Setup(),
			Path:    &checkoutLinkPath,
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
		{
			Handler: v1customerportallink.Setup(),
			Path:    &portalLinkPath,
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

func externalPost(mux *http.ServeMux, prefix *string) {
	var (
		awsS3PresignedUTL = "/file/presigned-url"
	)

	flows := []middleware.Flow{
		{
			Handler: v1s3presignedurl.Setup(),
			Path:    &awsS3PresignedUTL,
			Method:  http.MethodPost,
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
