package main

import "backend/cmd/app"

func main() {
	app.ScanFlags()
	app.SetupConfigs()
	app.SetupLogger()
	app.SetupApp()
	app.SetupAPIRoutes()
	app.SetupDatabases()
	app.SetupServer()
}
