package extxrate

import (
	"golang.org/x/time/rate"
)

type RateLimit = rate.Limit

type RateLimiter = rate.Limiter

func NewLimiter(limitsPerSecond RateLimit, brustSize int) *RateLimiter {
	return rate.NewLimiter(limitsPerSecond, brustSize)
}
