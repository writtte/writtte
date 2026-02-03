package flags

import (
	"flag"
)

const (
	LocalEnv int = iota
	StagingEnv
	ProductionEnv
)

const (
	DebugMode int = iota
	ReleaseMode
)

var (
	selectedEnvironment int
	selectedMode        int
	selectedAddress     string
	rLimitStatus        bool
	emailSendStatus     bool
	selectedEmailClient string
)

func Scan() {
	const emptyStr = ""

	env := flag.String("env", emptyStr, emptyStr)
	mode := flag.String("mode", emptyStr, emptyStr)
	address := flag.String("address", emptyStr, emptyStr)
	rLimitEnabled := flag.Bool("rlimit-enabled", false, emptyStr)
	emailSendEnabled := flag.Bool("emails-enabled", false, emptyStr)
	emailClient := flag.String("email-client", emptyStr, emptyStr)

	flag.Parse() // revive:disable-line

	selectedEnvironment = checkEnvironment(*env)
	selectedMode = checkMode(*mode)
	selectedAddress = checkAddresses(*address)
	rLimitStatus = bool(*rLimitEnabled)
	emailSendStatus = bool(*emailSendEnabled)
	selectedEmailClient = *emailClient
}

func ReturnEnvironment() int {
	return selectedEnvironment
}

func ReturnMode() int {
	return selectedMode
}

func ReturnAddress() string {
	return selectedAddress
}

func ReturnRateLimitStatus() bool {
	return rLimitStatus
}

func ReturnEmailSendStatus() bool {
	return emailSendStatus
}

func ReturnEmailClient() string {
	return selectedEmailClient
}
