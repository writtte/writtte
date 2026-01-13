package v1documentcreate

import (
	"context"

	"backend/cmd/glob"
	"backend/configs"
	"backend/helpers/files"
	"backend/pkg/extaws"
)

func createDocumentFile(ctx context.Context, accountCode,
	documentCode *string) error {
	if accountCode == nil || documentCode == nil {
		return nil
	}

	filePath := files.DocumentFilePath(accountCode, documentCode)
	if filePath == nil {
		return nil
	}

	// revive:disable:line-length-limit

	defaultFileContent := ""
	err := extaws.CreateFile(ctx, *glob.Config.AWSS3PrivateDirectoryBucketClient,
		extaws.S3FileCreateData{
			BucketName:  configs.AWSS3PrivateDirectoryBucketName,
			FileName:    *filePath,
			FileContent: []byte(defaultFileContent),
		})

	// revive:enable:line-length-limit

	return err
}
