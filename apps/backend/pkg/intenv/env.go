package intenv

import (
	"errors"
	"fmt"
	"os"
)

func Load(envKey string) string {
	value := os.Getenv(envKey)
	if value == "" {
		err := errors.New(fmt.Errorf(
			"failed to load environment variable %s", envKey).Error(),
		)

		panic(err.Error())
	}

	return value
}
