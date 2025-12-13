package inittmpl

import (
	"html/template"
	"os"
)

func Return(templatePath, fallbackContent *string) *template.Template {
	content := loadContentWithFallback(templatePath, fallbackContent)
	tmpl, err := template.New(*templatePath).Parse(*content)
	if err != nil {
		panic(err)
	}

	return tmpl
}

func loadContentWithFallback(filePath, fallbackContent *string) *string {
	content, err := os.ReadFile(*filePath)
	if err != nil {
		return fallbackContent
	}

	strContent := string(content)
	return &strContent
}
