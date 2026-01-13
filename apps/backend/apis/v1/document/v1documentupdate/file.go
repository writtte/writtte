package v1documentupdate

import (
	"context"

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

	contentToUpdate := newContent
	err := extaws.SaveFile(ctx, *glob.Config.AWSS3PrivateDirectoryBucketClient,
		extaws.S3FileCreateData{
			BucketName:  configs.AWSS3PrivateDirectoryBucketName,
			FileName:    *filePath,
			FileContent: []byte(*contentToUpdate),
		})

	return err
}
