package flags

func checkMode(mode string) int {
	var modeType int
	switch mode {
	case "debug":
		modeType = DebugMode

	case "release":
		modeType = ReleaseMode

	default:
		panic("invalid mode type provided in flags")
	}

	return modeType
}
