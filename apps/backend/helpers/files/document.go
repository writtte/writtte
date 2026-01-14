package files

import "backend/pkg/extaws"

const dirImages = "images"
const dirDocument = "documents"
const dirVersion = "versions"

func DocumentFilePath(accountCode, documentCode *string) *string {
	documentNameWithExt := *documentCode + ".json"
	filePath := extaws.GenerateS3FilePath(*accountCode,
		dirDocument, documentNameWithExt)

	return &filePath
}

func DocumentVersionFilePath(documentCode,
	versionDocument *string) *string {
	versionDocumentNameWithExt := *versionDocument + ".json"
	filePath := extaws.GenerateS3FilePath(dirVersion, *documentCode,
		versionDocumentNameWithExt)

	return &filePath
}

func DocumentImageFilePath(documentCode, imageCode,
	extension *string) *string {
	imageNameWithExt := *imageCode + "." + *extension
	filePath := extaws.GenerateS3FilePath(dirImages,
		*documentCode, imageNameWithExt)

	return &filePath
}
