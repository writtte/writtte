package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/item/v1treeadddocument"
	"backend/apis/v1/item/v1treeremovedocument"
	"backend/apis/v1/item/v1treeretrievefolderdocuments"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func Tree(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/tree"

	treeGet(mux, &basePrefix)
	treePost(mux, &basePrefix)
	treeDelete(mux, &basePrefix)
}

func treeGet(mux *http.ServeMux, prefix *string) {
	var (
		folderDocumentsPath = "/folder/documents"
	)

	flows := []middleware.Flow{
		{
			Handler: v1treeretrievefolderdocuments.Setup(),
			Path:    &folderDocumentsPath,
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

func treePost(mux *http.ServeMux, prefix *string) {
	var (
		addDocumentPath = "/document"
	)

	flows := []middleware.Flow{
		{
			Handler: v1treeadddocument.Setup(),
			Path:    &addDocumentPath,
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

func treeDelete(mux *http.ServeMux, prefix *string) {
	var (
		removeDocumentPath = "/document"
	)

	flows := []middleware.Flow{
		{
			Handler: v1treeremovedocument.Setup(),
			Path:    &removeDocumentPath,
			Method:  http.MethodDelete,
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
