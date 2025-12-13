package jsmatch

import (
	"strconv"
	"time"
)

func GetTimeFromInt(upToInMins int) *string {
	const unixMilliFactor = 10

	result := strconv.FormatInt(time.Now().
		Add(time.Duration(upToInMins)*time.Minute).UnixMilli(),
		unixMilliFactor)

	// Return unix timestamp in milliseconds

	return &result
}

func GetTimeFromTime(t time.Time) *string {
	const unixMilliFactor = 10

	result := strconv.FormatInt(
		t.UnixMilli(),
		unixMilliFactor,
	)

	return &result
}
