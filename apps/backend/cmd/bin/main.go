package main

import (
	"backend/cmd/connect"
	"backend/cmd/flags"
)

func main() {
	// Note:
	//
	// Do not change the order of the calls in main function

	flags.Scan()

	connect.SetupConfigs()
	connect.SetupLogger()
	connect.SetupApp()
	connect.SetupSentry()
	connect.Routes()
	connect.Databases()
	connect.Server()
}
