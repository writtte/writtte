package connect

import (
	"net/http"
	"strings"
	"sync"
	"time"

	"backend/cmd/flags"
	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	extgolog "backend/pkg/extlog"
)

type ServerInfo struct {
	URL            *string
	ReadTimeout    time.Duration
	WriteTimeout   time.Duration
	IdleTimeout    time.Duration
	AllowedOrigins string
	AllowedMethods string
	AllowedHeaders string
}

type CorsConfig struct {
	AllowedOrigins string // Comma-separated list of allowed origins
	AllowedMethods string // Comma-separated list of allowed HTTP methods
	AllowedHeaders string // Comma-separated list of allowed HTTP headers
}

func Server() {
	const (
		serverCount = 1

		readTimeout  = 15 * time.Second
		writeTimeout = 30 * time.Second
		idleTimeout  = 60 * time.Second
	)

	address := string(flags.ReturnAddress())

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
	createHTTPServer(glob.Config.HTTPHandler, *i, &wg)
	wg.Wait()
}

func createHTTPServer(handler http.Handler, i ServerInfo,
	wg *sync.WaitGroup) *http.Server {
	handler = serverCorsHandler(handler, CorsConfig{
		AllowedOrigins: i.AllowedOrigins,
		AllowedMethods: i.AllowedMethods,
		AllowedHeaders: i.AllowedHeaders,
	})

	server := &http.Server{
		Handler:      handler,
		Addr:         *i.URL,
		ReadTimeout:  i.ReadTimeout,
		WriteTimeout: i.WriteTimeout,
		IdleTimeout:  i.IdleTimeout,
	}

	go func() {
		dumpServerLog(i, *i.URL, extgolog.TypeInformation,
			constants.ServerStarting)

		defer wg.Done()
		startHTTP(server, i)
	}()

	dumpServerLog(i, *i.URL, extgolog.TypeSuccess, constants.ServerStarted)
	return server
}

func startHTTP(server *http.Server, info ServerInfo) {
	if err := server.ListenAndServe(); err != nil {
		dumpServerLog(info, server.Addr, extgolog.TypeError,
			constants.ServerStartedFailedHTTP)
		panic(err.Error())
	}
}

func dumpServerLog(info ServerInfo, addr string, logType extgolog.LogType,
	logMsg string) {
	jsonContent := map[string]any{
		constants.LogAddress: &addr,
		constants.LogURL:     info.URL,
	}

	switch logType {
	case extgolog.TypeInformation:
		glob.Config.Logger.Information(jsonContent, logMsg)

	case extgolog.TypeSuccess:
		glob.Config.Logger.Success(jsonContent, logMsg)

	case extgolog.TypeError:
		glob.Config.Logger.Error(jsonContent, logMsg)

	default:
	}
}

func serverCorsHandler(next http.Handler, config CorsConfig) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cleanHeaders := strings.ReplaceAll(config.AllowedHeaders, " ", "")

		(w).Header().Set("Access-Control-Allow-Origin", config.AllowedOrigins)
		(w).Header().Set("Access-Control-Allow-Methods", config.AllowedMethods)
		(w).Header().Set("Access-Control-Allow-Headers", cleanHeaders)

		if r.Method == http.MethodOptions {
			if w == nil {
				return
			}

			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
