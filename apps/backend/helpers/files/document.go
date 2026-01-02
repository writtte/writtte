package files

import "backend/pkg/extaws"

const dirImages = "images"
const dirDocument = "documents"

func DocumentFilePath(accountCode, articleCode *string) *string {
	articleNameWithExt := *articleCode + ".json"
	filePath := extaws.GenerateS3FilePath(*accountCode,
		dirDocument, articleNameWithExt)

	return &filePath
}

func DocumentImageFilePath(articleCode, imageCode,
	extension *string) *string {
	imageNameWithExt := *imageCode + "." + *extension
	filePath := extaws.GenerateS3FilePath(dirImages,
		*articleCode, imageNameWithExt)

	return &filePath
}
