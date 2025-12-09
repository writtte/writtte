package app

import (
	"backend/configs"
	"backend/constants"
	extgolog "backend/pkg/extlog"
	"backend/pkg/extpgx"
)

func CreateMainDBPool() {
	uri := extpgx.PsqlURI{
		Host:     configs.MainSQLDBHost,
		Port:     configs.MainSQLDBPort,
		User:     configs.MainSQLDBUser,
		Password: configs.MainSQLDBPass,
		Database: configs.MainSQLDBName,
	}

	connStr := extpgx.GenerateURI(uri)
	dumpMainDBLog(uri, extgolog.TypeInformation,
		constants.DatabaseConnectionStarting)

	var err error
	Config.MainSQLDB, err = extpgx.CreatePool(connStr)
	if err != nil {
		dumpMainDBLog(uri, extgolog.TypeError,
			constants.DatabaseConnectionFailed)

		panic(err)
	}

	dumpMainDBLog(uri, extgolog.TypeSuccess,
		constants.DatabaseConnectionSuccess)
}

func dumpMainDBLog(uri extpgx.PsqlURI,
	logType extgolog.LogType, logMsg string) {
	jsonContent := map[string]any{
		constants.LogHost:     &uri.Host,
		constants.LogPort:     &uri.Port,
		constants.LogDatabase: &uri.Database,
	}

	switch logType {
	case extgolog.TypeInformation:
		Config.Logger.Information(jsonContent, logMsg)

	case extgolog.TypeSuccess:
		Config.Logger.Success(jsonContent, logMsg)

	case extgolog.TypeError:
		Config.Logger.Error(jsonContent, logMsg)

	default:
	}
}
