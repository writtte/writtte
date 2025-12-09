package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/getsentry/sentry-go"

	"backend/cmd/app"
	"backend/cmd/glob"
	"backend/helpers/response"
	"backend/pkg/intstr"
)

func RecoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				handlePanic(w, r, rec)
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func handlePanic(w http.ResponseWriter, r *http.Request, err any) {
	// Add the panic to Sentry for error tracking

	sentry.CurrentHub().Recover(err)
	sentry.Flush(2 * time.Second)

	if glob.Config.Environment != app.ProductionEnv {
		// This is printed in the terminal only in non-production
		// environments

		panic(err)
	}

	errStr := fmt.Sprintf("panic recovered: %v\nstack trace:\n%s",
		err, debug.Stack())

	response.Internal(w, r, nil, intstr.StrPtr((errStr)))
}
