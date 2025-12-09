package glob

import (
	"net/http"

	"github.com/go-playground/validator/v10"

	extgolog "backend/pkg/extlog"
	"backend/pkg/extpgx"
)

type GlobalConfiguration struct {
	Environment int
	RunningMode int
	HTTPHandler http.Handler
	MainSQLDB   *extpgx.PsqlPool
	Logger      *extgolog.GoLog
	Validator   *validator.Validate
	RateLimit   bool
}

var Config *GlobalConfiguration
