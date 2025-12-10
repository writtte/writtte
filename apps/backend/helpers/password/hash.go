package password

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"io"

	"backend/pkg/extcrypt"
)

func Hash(rawPassword string) (hashed string, salt string) {
	const (
		argon2Time    uint32 = 1
		argon2Memory  uint32 = 64 * 1024
		argon2Threads uint8  = 4
		argon2KeyLen  uint32 = 32
	)

	passwordSalt := genSalt()
	hashedPassword := extcrypt.GenerateArgon2(argon2Time, argon2Memory,
		argon2Threads, argon2KeyLen, rawPassword, string(passwordSalt))

	return base64.URLEncoding.EncodeToString(hashedPassword),
		base64.URLEncoding.EncodeToString(passwordSalt)
}

func genSalt() []byte {
	const saltLen = 16
	salt := make([]byte, saltLen)
	_, _ = io.ReadFull(rand.Reader, salt)
	return salt
}

func Validate(rawPassword, hashedPassword, salt string) bool {
	const (
		argon2Time    uint32 = 1
		argon2Memory  uint32 = 64 * 1024
		argon2Threads uint8  = 4
		argon2KeyLen  uint32 = 32
	)

	decodedSalt, err := base64.URLEncoding.DecodeString(salt)
	if err != nil {
		return false
	}

	expectedHash := extcrypt.GenerateArgon2(argon2Time, argon2Memory,
		argon2Threads, argon2KeyLen, rawPassword, string(decodedSalt))

	decodedHash, err := base64.URLEncoding.DecodeString(hashedPassword)
	if err != nil {
		return false
	}

	const equal = 1
	return subtle.ConstantTimeCompare(expectedHash, decodedHash) == equal
}
