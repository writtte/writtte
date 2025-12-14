package files

import "backend/pkg/extaws"

const dirDocument = "documents"

func DocumentFilePath(accountCode, articleCode *string) *string {
	articleNameWithExt := *articleCode + ".json"
	filePath := extaws.GenerateS3FilePath(*accountCode,
		dirDocument, articleNameWithExt)

	return &filePath
}
