package privateroutes

import (
	"fmt"
	"net/http"

	"backend/apis/v1/webhook/v1polarorderpaid"
	"backend/apis/v1/webhook/v1polarsubscriptionrevoked"
	"backend/cmd/glob"
	"backend/constants"
	"backend/middleware"
)

func Webhook(mux *http.ServeMux, prefix *string) {
	basePrefix := *prefix + "/webhook"

	webhookPost(mux, &basePrefix)
}

func webhookPost(mux *http.ServeMux, prefix *string) {
	var (
		orderPaidPath           = "/order-paid"
		subscriptionRevokedPath = "/subscription-revoked"
	)

	flows := []middleware.Flow{
		{
			Handler: v1polarorderpaid.Setup(),
			Path:    &orderPaidPath,
			Method:  http.MethodPost,
			Rates: &middleware.Rates{
				ReqLimit: middleware.ReqLimit5,
				Window:   middleware.Window1,
				TTL:      middleware.TTLDefault,
			},
		},
		{
			Handler: v1polarsubscriptionrevoked.Setup(),
			Path:    &subscriptionRevokedPath,
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

		*flow.Path = fmt.Sprintf("%s %s%s", flow.Method, // revive:disable-line
			*prefix, *flow.Path)
		mux.Handle(*flow.Path, middleware.Apply(flow))
	}
}
