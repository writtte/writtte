package v1documentupdate

import (
	"context"
	"encoding/json"

	"backend/cmd/glob"
	"backend/configs"
	"backend/constants"
	"backend/helpers/files"
	"backend/pkg/extaws"
	"backend/pkg/extsentry"
	"backend/pkg/intstr"
)

const timeGapThirtyMin = 30

func (s *service) checkAndSetVersionFile(ctx context.Context,
	documentCode, content, updatedTime *string) {
	versionTimeGapInMins := timeGapThirtyMin

	results, err := s.repo.performVersionCreate(ctx, &dbQueryInputVersionData{
		DocumentCode: documentCode,
		StoredType:   intstr.StrPtr("AUTOMATIC"),
		CurrentTime:  updatedTime,
		TimeToCheck:  &versionTimeGapInMins,
	})

	if err != nil {
		extsentry.CaptureSentryError(ctx, err, map[string]any{
			constants.LogDetails: results,
		})

		return
	}

	var parsedResults *dbQueryOutputCreateVersion
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		extsentry.CaptureSentryError(ctx, err, map[string]any{
			constants.LogDetails: results,
		})

		return
	}

	if !*parsedResults.Status {
		extsentry.CaptureSentryError(ctx, err, map[string]any{
			constants.LogDetails: results,
		})

		return
	}

	if *parsedResults.Code == constants.VersionIgnored {
		// In this case, the document should not be created in storage.

		return
	}

	if parsedResults.Data.VersionCode == nil {
		extsentry.CaptureSentryError(ctx, err, map[string]any{
			constants.LogDetails: results,
		})

		return
	}

	err = createDocumentVersionFile(ctx, documentCode,
		parsedResults.Data.VersionCode, content)

	if err != nil {
		extsentry.CaptureSentryError(ctx, err, map[string]any{
			constants.LogDetails: results,
		})

		return
	}
}

func createDocumentVersionFile(ctx context.Context, documentCode,
	versionDocumentCode, content *string) error {
	if documentCode == nil ||
		versionDocumentCode == nil {
		return nil
	}

	filePath := files.DocumentVersionFilePath(documentCode,
		versionDocumentCode)

	if filePath == nil {
		return nil
	}

	// revive:disable:line-length-limit

	err := extaws.CreateFile(ctx, *glob.Config.AWSS3PrivateDirectoryBucketClient,
		extaws.S3FileCreateData{
			BucketName:  configs.AWSS3PrivateDirectoryBucketName,
			FileName:    *filePath,
			FileContent: []byte(*content),
		})

	// revive:enable:line-length-limit

	return err
}
