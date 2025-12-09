package intstr

func Safe(s *string) string {
	if s == nil {
		return "(nil)"
	}

	return *s
}
