package extsentry

import (
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
