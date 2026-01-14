package v1documentversionretrieve

import (
	"context"

	"backend/cmd/glob"
	"backend/configs"
	"backend/helpers/files"
	"backend/pkg/extaws"
)

func getVersionDocumentContent(ctx context.Context, documentCode,
	versionCode *string) (*extaws.S3FileRetrieveData, error) {
	filePath := files.DocumentVersionFilePath(documentCode, versionCode)
	if filePath == nil {
		return nil, nil
	}

	retrievedData, err := extaws.ReadFile(ctx,
		*glob.Config.AWSS3PrivateDirectoryBucketClient,
		&configs.AWSS3PrivateDirectoryBucketName, filePath,
		&configs.AWSS3PrivateDirectoryBucketAccountID)

	return retrievedData, err
}
