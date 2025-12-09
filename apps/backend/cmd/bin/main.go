package main

import (
	"backend/cmd/connect"
	"backend/cmd/flags"
)

func main() {
	flags.Scan()

	connect.SetupConfigs()
	connect.SetupLogger()
	connect.SetupApp()
	connect.Routes()
	connect.Databases()
	connect.Server()
}
