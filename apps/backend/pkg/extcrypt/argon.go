package extcrypt

import (
	"golang.org/x/crypto/argon2"
)

func GenerateArgon2(time, memory uint32, threads uint8,
	keyLen uint32, input, salt string) []byte {
	return argon2.IDKey([]byte(input),
		[]byte(salt), time, memory, threads, keyLen)
}
