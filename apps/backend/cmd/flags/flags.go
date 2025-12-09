package flags

import "flag"

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
	sesStatus           bool
)

func Scan() {
	const emptyStr = ""

	env := flag.String("env", emptyStr, emptyStr)
	mode := flag.String("mode", emptyStr, emptyStr)
	address := flag.String("address", emptyStr, emptyStr)
	rLimitEnabled := flag.Bool("rlimit-enabled", false, emptyStr)
	sesEnabled := flag.Bool("ses-enabled", false, emptyStr)

	// revive:disable-next-line
	flag.Parse()

	selectedEnvironment = checkEnvironment(*env)
	selectedMode = checkMode(*mode)
	selectedAddress = checkAddresses(*address)
	rLimitStatus = bool(*rLimitEnabled)
	sesStatus = bool(*sesEnabled)
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

func ReturnSESStatus() bool {
	return sesStatus
}
