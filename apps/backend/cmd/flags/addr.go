package flags

func checkAddresses(address string) string {
	if address == "" {
		panic("server address cannot be empty")
	}

	return address
}
