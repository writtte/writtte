package v1documentretrieve

import (
	"context"

	"backend/cmd/glob"
	"backend/configs"
	"backend/helpers/files"
	"backend/pkg/extaws"
)

func getDocumentContent(ctx context.Context, accountCode,
	documentCode *string) (*extaws.S3FileRetrieveData, error) {
	if accountCode == nil || documentCode == nil {
		return nil, nil
	}

	filePath := files.DocumentFilePath(accountCode, documentCode)
	if filePath == nil {
		return nil, nil
	}

	retrievedData, err := extaws.ReadFile(ctx,
		*glob.Config.AWSS3PrivateDirectoryBucketClient,
		&configs.AWSS3PrivateDirectoryBucketName, filePath,
		&configs.AWSS3PrivateDirectoryBucketAccountID)

	return retrievedData, err
}
