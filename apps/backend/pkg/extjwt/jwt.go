package extjwt

import (
	"maps"

	"github.com/golang-jwt/jwt/v5"
)

type SigningMethod = jwt.SigningMethod

type JWTToken = jwt.Token

type MapClaims = jwt.MapClaims

type Info struct {
	Token     string        // Secret key used to sign the token
	Sign      SigningMethod // Method used to sign the JWT
	Algorithm string        // Algorithm identifier (e.g., "HS256")
	Type      string        // Token type (typically "jwt")
	Claims    Claims        // Claims to be included in the token
}

type Claims struct {
	Exp    int64           // Expiration time (Unix timestamp)
	Iat    int64           // Issued at time (Unix timestamp)
	Custom *map[string]any // Custom claims to be included in the token
}

var (
	SigningMethodHS256 = jwt.SigningMethodHS256
)

const (
	JWTType           = "jwt"   // Standard JWT token type
	JWTAlgorithmHS256 = "HS256" // HMAC with SHA-256 algorithm identifier
)

func ParseJWT(secretKey []byte, parsedToken string) (*JWTToken, error) {
	jwtKey := secretKey
	jwtToken, err := jwt.Parse(parsedToken, func(_ *jwt.Token) (any, error) {
		return jwtKey, nil
	})

	return (*JWTToken)(jwtToken), err
}

func GenerateToken(i Info) (string, error) {
	token := jwt.NewWithClaims(i.Sign, jwt.MapClaims{
		"exp": i.Claims.Exp,
		"iat": i.Claims.Iat,
	})

	if i.Claims.Custom != nil {
		maps.Copy(token.Claims.(jwt.MapClaims), *i.Claims.Custom)
	}

	tokenStr, err := token.SignedString([]byte(i.Token))
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}

func DecodeSecretKey(secretKey string) ([]byte, error) {
	return []byte(secretKey), nil
}
