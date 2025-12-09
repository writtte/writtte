package app

import (
	"net/http"
	"sync"
	"time"

	"github.com/go-playground/validator/v10"

	"backend/configs"
	extgolog "backend/pkg/extlog"
	"backend/pkg/extpgx"
	"backend/pkg/extvalidator"
)

type ApplicationConfig struct {
	Environment int
	RunningMode int
	HTTPHandler http.Handler
	MainSQLDB   *extpgx.PsqlPool
	Logger      *extgolog.GoLog
	Validator   *validator.Validate
	RateLimit   bool
}

var Config *ApplicationConfig

func SetupConfigs() {
	configs.EnvironmentEnvs()
	configs.LogEnvs()
	configs.ServerEnvs()
	configs.DatabaseEnvs()
	configs.FrontendEnvs()
}

func SetupLogger() {
	Config = &ApplicationConfig{
		Logger: extgolog.InitLogger(extgolog.Config{
			Destination: configs.LogDestination,
			Rotation:    configs.LogRotation,
		}),
	}
}

func SetupApp() {
	// Note:
	//
	// Do not change the order of the calls

	Config.Environment = ReturnEnvironment()
	Config.RunningMode = ReturnMode()
	Config.HTTPHandler = http.NewServeMux()
	Config.MainSQLDB = &extpgx.PsqlPool{}
	Config.RateLimit = ReturnRateLimitStatus()
	Config.Validator = extvalidator.Init()
}

func SetupAPIRoutes() {}

func SetupDatabases() {
	CreateMainDBPool()
}

func SetupServer() {
	const (
		serverCount = 1

		readTimeout  = 15 * time.Second
		writeTimeout = 30 * time.Second
		idleTimeout  = 60 * time.Second
	)

	address := string(ReturnAddress())

	i := &ServerInfo{
		URL:            &address,
		ReadTimeout:    readTimeout,
		WriteTimeout:   writeTimeout,
		IdleTimeout:    idleTimeout,
		AllowedOrigins: configs.AllowedOrigins,
		AllowedMethods: configs.AllowedMethods,
		AllowedHeaders: configs.AllowedHeaders,
	}

	var wg sync.WaitGroup
	wg.Add(serverCount)
	CreateHTTPServer(Config.HTTPHandler, *i, &wg)
	wg.Wait()
}
