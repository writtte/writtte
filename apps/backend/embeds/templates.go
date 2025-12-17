package embeds

import "html/template"

type EmailTemplateFiles struct {
	AccountEmailUpdate *template.Template
	SignInQuickLink    *template.Template
	SignUpLink         *template.Template
	SignUpWelcome      *template.Template
}
