package files

import "backend/pkg/extaws"

const dirImages = "images"
const dirDocument = "documents"

func DocumentFilePath(accountCode, draftCode *string) *string {
	draftNameWithExt := *draftCode + ".json"
	filePath := extaws.GenerateS3FilePath(*accountCode,
		dirDocument, draftNameWithExt)

	return &filePath
}

func DocumentImageFilePath(draftCode, imageCode,
	extension *string) *string {
	imageNameWithExt := *imageCode + "." + *extension
	filePath := extaws.GenerateS3FilePath(dirImages,
		*draftCode, imageNameWithExt)

	return &filePath
}
