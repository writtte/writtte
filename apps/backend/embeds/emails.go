package embeds

import (
	_ "embed"

	inittmpl "backend/pkg/inttmpl"
)

//go:embed html/emails/sign-up-link.html
var EmbedSignUpLink string

var (
	PathSignUpLink = "html/emails/sign-up-link.html"
)

func SetupEmailTemplates() *EmailTemplateFiles {
	return &EmailTemplateFiles{
		SignUpLink: inittmpl.Return(&PathSignUpLink, &EmbedSignUpLink),
	}
}
