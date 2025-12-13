package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"backend/constants"
	"backend/helpers/response"
	"backend/pkg/extxrate"
)

// revive:disable:line-length-limit

const (
	ReqLimit1   = 1   // 1 request per time window
	ReqLimit2   = 2   // 2 requests per time window
	ReqLimit5   = 5   // 5 requests per time window
	ReqLimit10  = 10  // 10 requests per time window
	ReqLimit100 = 100 // 100 requests per time window

	Window1  = 1  // 1 token bucket size
	Window2  = 2  // 2 token bucket size
	Window5  = 5  // 5 token bucket size
	Window10 = 10 // 10 token bucket size

	TTLDefault = 3 * time.Second // Default time-to-live for client rate limit entries
)

type Rates struct {
	ReqLimit extxrate.RateLimit // Maximum requests per second
	Window   int                // Burst size for the token bucket algorithm
	TTL      time.Duration      // Time-to-live for client entries in the rate limiter
}

// revive:enable:line-length-limit

type clientData struct {
	RateLimiter *extxrate.RateLimiter // The rate limiter for this client
	LastSeen    time.Time             // When this client was last seen
}

func LimitRate(next http.Handler, rates Rates) http.Handler {
	var (
		mu     sync.Mutex
		ipList = make(map[string]*clientData)
	)

	go func() {
		ticker := time.NewTicker(rates.TTL)
		defer ticker.Stop()
		for range ticker.C {
			cleanOldIPs(&mu, ipList, rates.TTL)
		}
	}()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			response.Error(w, r, http.StatusBadRequest,
				constants.ErrorMiddlewareRateLimitInvalidIP)

			return
		}

		if !allowRequest(&mu, id, ipList, rates) {
			response.Error(w, r, http.StatusTooManyRequests,
				constants.ErrorMiddlewareRateLimitExceeded)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func cleanOldIPs(mu *sync.Mutex, ipList map[string]*clientData,
	ttl time.Duration) {
	mu.Lock()
	defer mu.Unlock()

	now := time.Now()
	for ip, data := range ipList {
		if now.Sub(data.LastSeen) > ttl {
			delete(ipList, ip)
		}
	}
}

func allowRequest(mu *sync.Mutex, ip string,
	ipList map[string]*clientData, rates Rates) bool {
	mu.Lock()
	defer mu.Unlock()

	if _, ok := ipList[ip]; !ok {
		ipList[ip] = &clientData{
			RateLimiter: extxrate.NewLimiter(rates.ReqLimit, rates.Window),
		}
	}

	ipList[ip].LastSeen = time.Now()
	return ipList[ip].RateLimiter.Allow()
}
