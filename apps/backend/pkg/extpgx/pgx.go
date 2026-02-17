package extpgx

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PsqlURI struct {
	Host     string // Server hostname or IP address
	Port     string // Server port
	User     string // Username
	Password string // #nosec G117 User password
	Database string // Name
}

type PsqlPool struct {
	Pool *pgxpool.Pool
}

func CreatePool(connStr string) (*PsqlPool, error) {
	pool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		return nil, err
	}

	testErr := testConnection(&PsqlPool{Pool: pool})
	if testErr != nil {
		return nil, testErr
	}

	return &PsqlPool{Pool: pool}, nil
}

func GenerateURI(uri PsqlURI) string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		uri.User, uri.Password, uri.Host, uri.Port, uri.Database)
}

func testConnection(db *PsqlPool) error {
	conn, err := db.Pool.Acquire(context.Background())
	if err != nil {
		return err
	}

	defer conn.Release()
	return nil
}

func ClosePool(db *PsqlPool) {
	db.Pool.Close()
}
