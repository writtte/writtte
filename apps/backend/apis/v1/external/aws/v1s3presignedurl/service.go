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
	typeDocumentImage = "document-image"
	actionGet         = "get"
	actionPut         = "put"
	actionDelete      = "delete"
)

func (s *service) perform(ctx context.Context, body *BodyParams,
) (*string, error) {
	var generatedURL *string

	client := glob.Config.AWSS3PrivateGeneralBucketClient
	bucket := configs.AWSS3PrivateGeneralBucketName

	switch *body.Action {
	case actionGet:
		{
			var err error

			key := getKeyForGetAction(body)
			generatedURL, err = extaws.GenerateGetPresignedURL(ctx, *client,
				bucket, *key, expirationMinutes*time.Minute)

			if err != nil {
				return nil, err
			}
		}

	case actionPut:
		{
			key, err := s.getKey(ctx, body)
			if err != nil {
				return nil, err
			}

			generatedURL, err = extaws.GeneratePutPresignedURL(ctx, *client,
				bucket, *key, expirationMinutes*time.Minute)
		}

	case actionDelete:
		{
			var err error

			key := getKeyForGetAction(body)
			generatedURL, err = extaws.GenerateDeletePresignedURL(ctx, *client,
				bucket, *key, expirationMinutes*time.Minute)

			if err != nil {
				return nil, err
			}
		}

	default:
		panic("action not supported")
	}

	return generatedURL, nil
}

func getKeyForGetAction(body *BodyParams) *string {
	var key string

	switch *body.Type {
	case typeDocumentImage:
		key = *files.DocumentImageFilePath(body.DocumentCode,
			body.ImageCode, body.ImageExtension)

	default:
		panic("type not supported")
	}

	return &key
}

func (s *service) getKey(ctx context.Context, body *BodyParams,
) (*string, error) {
	var key string

	results, err := s.repo.performImageCreate(ctx, body.DocumentCode,
		body.ImageCode)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutputForImage
	if err := json.Unmarshal([]byte(*results),
		&parsedResults); err != nil {
		return nil, err
	}

	if !(*parsedResults.Status &&
		*parsedResults.Code == constants.ImageCreated) {
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
