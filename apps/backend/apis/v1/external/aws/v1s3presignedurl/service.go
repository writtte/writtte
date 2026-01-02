package v1s3presignedurl

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/helpers/files"
	"backend/pkg/extaws"
)

type service struct {
	repo repository
}

const (
	expirationMinutes = 5
	bucketPrivate     = "private"
	typeDocumentImage = "document-image"
	actionGet         = "get"
	actionPut         = "put"
	actionDelete      = "delete"
)

func (s *service) perform(ctx context.Context, body *BodyParams,
) (*string, error) {
	var client *extaws.S3Client
	var bucket string
	var generatedURL *string

	key, err := s.getKey(ctx, body)
	if err != nil {
		return nil, err
	}

	switch *body.Bucket {
	case bucketPrivate:
		client = glob.Config.AWSS3PrivateDirectoryBucketClient
		bucket = configs.AWSS3PrivateDirectoryBucketName

	default:
		panic("bucket not supported")
	}

	switch *body.Action {
	case actionGet:
		generatedURL, err = extaws.GenerateGetPresignedURL(ctx, *client,
			bucket, *key, expirationMinutes*time.Minute)

	case actionPut:
		generatedURL, err = extaws.GeneratePutPresignedURL(ctx, *client,
			bucket, *key, expirationMinutes*time.Minute)

	case actionDelete:
		generatedURL, err = extaws.GenerateDeletePresignedURL(ctx, *client,
			bucket, *key, expirationMinutes*time.Minute)

	default:
		panic("action not supported")
	}

	return generatedURL, err
}

func (s *service) getKey(ctx context.Context, body *BodyParams,
) (*string, error) {
	var key string

	results, err := s.repo.performImageCreate(ctx, body.DocumentCode)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutputForImage
	if err := json.Unmarshal([]byte(*results),
		&parsedResults); err != nil {
		return nil, err
	}

	if *parsedResults.Status ||
		*parsedResults.Code != constants.ImageCreated {
		return nil, errors.New(*parsedResults.Message)
	}

	switch *body.Type {
	case typeDocumentImage:
		key = *files.DocumentImageFilePath(body.DocumentCode,
			parsedResults.Data.ImageCode, body.ImageExtension)

	default:
		panic("type not supported")
	}

	return &key, nil
}
