package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/authentication/v1signin"
	"backend/apis/v1/item/v1foldercreate"
	"backend/apis/v1/item/v1folderdelete"
	"backend/apis/v1/item/v1folderretrieve"
	"backend/apis/v1/item/v1folderretrievelist"
	"backend/apis/v1/item/v1folderupdate"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/middleware"
)

func Folder(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/folder"

	folderGet(mux, &basePrefix)
	folderPost(mux, &basePrefix)
	folderPatch(mux, &basePrefix)
	folderDelete(mux, &basePrefix)
}

func folderGet(mux *http.ServeMux, prefix *string) {
	var (
		folderPath     = ""
		folderListPath = "/list"
	)

	flows := []middleware.Flow{
		{
			Handler: v1folderretrieve.Setup(),
			Path:    &folderPath,
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
			Handler: v1folderretrievelist.Setup(),
			Path:    &folderListPath,
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

func folderPost(mux *http.ServeMux, prefix *string) {
	var (
		folderPath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1foldercreate.Setup(),
			Path:    &folderPath,
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

func folderPatch(mux *http.ServeMux, prefix *string) {
	var (
		folderPath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1folderupdate.Setup(),
			Path:    &folderPath,
			Method:  http.MethodPatch,
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

func folderDelete(mux *http.ServeMux, prefix *string) {
	var (
		folderPath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1folderdelete.Setup(),
			Path:    &folderPath,
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
