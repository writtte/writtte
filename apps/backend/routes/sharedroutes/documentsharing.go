package sharedroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/documentsharing/v1documentsharingretrieve"
	"backend/cmd/glob"
	"backend/constants"
	"backend/middleware"
)

func DocumentSharing(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/sharing"

	documentSharingGet(mux, &basePrefix)
}

func documentSharingGet(mux *http.ServeMux, prefix *string) {
	var (
		documentPath = "/document"
	)

	flows := []middleware.Flow{
		{
			Handler: v1documentsharingretrieve.Setup(),
			Path:    &documentPath,
			Method:  http.MethodGet,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit5,
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

		*flow.Path = fmt.Sprintf("%s %s%s", flow.Method,
			*prefix, *flow.Path)
		mux.Handle(*flow.Path, middleware.Apply(flow))
	}
}
