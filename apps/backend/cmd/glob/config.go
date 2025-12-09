package glob

import (
	"net/http"

	"github.com/go-playground/validator/v10"

	"backend/pkg/extaws"
	extgolog "backend/pkg/extlog"
	"backend/pkg/extpgx"
)

type GlobalConfiguration struct {
	Environment           int
	RunningMode           int
	HTTPHandler           http.Handler
	MainSQLDB             *extpgx.PsqlPool
	Logger                *extgolog.GoLog
	Validator             *validator.Validate
	AWSSESConfig          *extaws.AWSSESConfig
	AWSSESSession         *extaws.AWSSESSession
	RateLimit             bool
	UseLocalSESInLocalEnv bool
}

var Config *GlobalConfiguration
