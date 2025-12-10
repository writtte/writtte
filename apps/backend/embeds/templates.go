package embeds

import "html/template"

type EmailTemplateFiles struct {
	SignInQuickLink *template.Template
	SignUpLink      *template.Template
	SignUpWelcome   *template.Template
}
