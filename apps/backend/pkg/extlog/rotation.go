package extgolog

import (
	"strconv"
)

func setLogRotation(rot string) int64 {
	const base = 10    // Number is in decimal format
	const bitSize = 64 // Size of the integer
	rotation, err := strconv.ParseInt(rot, base, bitSize)
	if err != nil {
		panic(err.Error())
	}

	return rotation
}
