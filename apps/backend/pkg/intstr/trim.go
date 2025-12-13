package intstr

import (
	"strings"
	"unicode"
)

func Trim(s string) string {
	var b strings.Builder
	for _, r := range s {
		if !unicode.IsSpace(r) {
			_, _ = b.WriteRune(r)
		}
	}

	return b.String()
}
