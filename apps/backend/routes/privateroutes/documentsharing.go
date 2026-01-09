package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/documentsharing/v1documentsharingcreate"
	"backend/apis/v1/documentsharing/v1documentsharingdelete"
	"backend/apis/v1/documentsharing/v1documentsharingretrievelist"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func DocumentSharing(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/sharing"

	documentSharingGet(mux, &basePrefix)
	documentSharingPost(mux, &basePrefix)
	documentSharingDelete(mux, &basePrefix)
}

func documentSharingGet(mux *http.ServeMux, prefix *string) {
	var (
		documentListSharingPath = "/document/list"
	)

	flows := []middleware.Flow{
		{
			Handler: v1documentsharingretrievelist.Setup(),
			Path:    &documentListSharingPath,
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

func documentSharingPost(mux *http.ServeMux, prefix *string) {
	var (
		documentSharingPath = "/document"
	)

	flows := []middleware.Flow{
		{
			Handler: v1documentsharingcreate.Setup(),
			Path:    &documentSharingPath,
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

func documentSharingDelete(mux *http.ServeMux, prefix *string) {
	var (
		documentSharingPath = "/document"
	)

	flows := []middleware.Flow{
		{
			Handler: v1documentsharingdelete.Setup(),
			Path:    &documentSharingPath,
			Method:  http.MethodDelete,
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
