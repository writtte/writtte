package configs

import (
	"backend/pkg/intenv"
)

var (
	MainSQLDBHost string
	MainSQLDBPort string
	MainSQLDBUser string
	MainSQLDBPass string
	MainSQLDBName string
)

// revive:disable:line-length-limit

func DatabaseEnvs() {
	MainSQLDBHost = intenv.Load("BE_DB_SQL_MAIN_HOST")
	MainSQLDBPort = intenv.Load("BE_DB_SQL_MAIN_PORT")
	MainSQLDBUser = intenv.Load("BE_DB_SQL_MAIN_USER")
	MainSQLDBPass = intenv.Load("BE_DB_SQL_MAIN_PASSWORD")
	MainSQLDBName = intenv.Load("BE_DB_SQL_MAIN_NAME")
}
