package publicroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/documentsharingview/v1documentsharingviewcreate"
	"backend/cmd/glob"
	"backend/constants"
	"backend/middleware"
)

func DocumentSharingView(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/sharing/views"

	documentSharingViewPost(mux, &basePrefix)
}

func documentSharingViewPost(mux *http.ServeMux, prefix *string) {
	var (
		createPath = ""
	)

	flows := []middleware.Flow{
		{
			Handler: v1documentsharingviewcreate.Setup(),
			Path:    &createPath,
			Method:  http.MethodPost,
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
