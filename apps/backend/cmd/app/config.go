package app

import (
	"errors"
	"net/http"
	"sync"
	"time"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	extgolog "backend/pkg/extlog"
	"backend/pkg/extpgx"
	"backend/pkg/extvalidator"
	"backend/routes"
)

func SetupConfigs() {
	configs.EnvironmentEnvs()
	configs.LogEnvs()
	configs.ServerEnvs()
	configs.DatabaseEnvs()
	configs.FrontendEnvs()
}

func SetupLogger() {
	glob.Config = &glob.GlobalConfiguration{
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

	glob.Config.Environment = ReturnEnvironment()
	glob.Config.RunningMode = ReturnMode()
	glob.Config.HTTPHandler = http.NewServeMux()
	glob.Config.MainSQLDB = &extpgx.PsqlPool{}
	glob.Config.RateLimit = ReturnRateLimitStatus()
	glob.Config.Validator = extvalidator.Init()
}

func SetupAPIRoutes() {
	mux, ok := glob.Config.HTTPHandler.(*http.ServeMux)
	if !ok {
		panic(errors.New(constants.ErrorInvalidTypeServerMux))
	}

	routes.Shared(mux)
}

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
	CreateHTTPServer(glob.Config.HTTPHandler, *i, &wg)
	wg.Wait()
}
