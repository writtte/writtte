package v1documentupdate

import (
	"context"
	"encoding/base64"

	"backend/cmd/glob"
	"backend/configs"
	"backend/helpers/files"
	"backend/pkg/extaws"
)

func updateContent(ctx context.Context, accountCode, documentCode,
	newContent *string) error {
	if accountCode == nil || documentCode == nil {
		return nil
	}

	filePath := files.DocumentFilePath(accountCode, documentCode)
	if filePath == nil {
		return nil
	}

	decodedContent, err := decodeContent(newContent)
	if err != nil {
		return err
	}

	err = extaws.SaveFile(ctx, *glob.Config.AWSS3PrivateDirectoryBucketClient,
		extaws.S3FileCreateData{
			BucketName:  configs.AWSS3PrivateDirectoryBucketName,
			FileName:    *filePath,
			FileContent: []byte(*decodedContent),
		})

	return err
}

func decodeContent(content *string) (*string, error) {
	decodedBytes, err := base64.StdEncoding.DecodeString(*content)
	if err != nil {
		return nil, err
	}

	decodedString := string(decodedBytes)
	return &decodedString, nil
}
