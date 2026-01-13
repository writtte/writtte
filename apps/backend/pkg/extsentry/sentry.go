package extsentry

import (
	"context"
	"strings"

	"github.com/getsentry/sentry-go"
)

func InitSentry(dsn, environment string) error {
	isDebugModeEnabled := strings.ToLower(environment) != "production"

	sentryClientOptions := sentry.ClientOptions{
		Dsn:              dsn,
		Debug:            isDebugModeEnabled,
		AttachStacktrace: true,
		EnableLogs:       true,
		EnableTracing:    true,
		Environment:      environment,
		Integrations: func(integrations []sentry.Integration,
		) []sentry.Integration {
			var filteredIntegrations []sentry.Integration
			for _, integration := range integrations {
				if integration.Name() == "ContextifyFrames" {
					continue
				}

				filteredIntegrations = append(filteredIntegrations, integration)
			}

			return filteredIntegrations
		},
	}

	return sentry.Init(sentryClientOptions)
}

// revive:disable:cognitive-complexity

func CaptureSentryError(ctx context.Context, err error,
	extras map[string]any) *sentry.EventID {
	if err == nil {
		return nil
	}

	hub := sentry.CurrentHub().Clone()

	if ctx != nil {
		if userID, ok := ctx.Value("user_id").(string); ok {
			hub.ConfigureScope(func(scope *sentry.Scope) {
				scope.SetUser(sentry.User{ID: userID})
			})
		}

		if requestID, ok := ctx.Value("request_id").(string); ok {
			hub.ConfigureScope(func(scope *sentry.Scope) {
				scope.SetTag("request_id", requestID)
			})
		}
	}

	if extras != nil {
		hub.ConfigureScope(func(scope *sentry.Scope) {
			for key, value := range extras {
				scope.SetExtra(key, value)
			}
		})
	}

	eventID := hub.CaptureException(err)
	return eventID
}

// revive:enable:cognitive-complexity
