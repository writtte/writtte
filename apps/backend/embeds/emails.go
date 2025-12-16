package embeds

import (
	_ "embed"

	inittmpl "backend/pkg/inttmpl"
)

// revive:disable:line-length-limit

//go:embed html/emails/account-email-update.html
var EmailAccountEmailUpdate string

//go:embed html/emails/sign-in-quick.html
var EmailSignInQuickLink string

//go:embed html/emails/sign-up-link.html
var EmbedSignUpLink string

//go:embed html/emails/sign-up-welcome.html
var EmbedSignUpWelcome string

var (
	PathAccountEmailUpdate = "html/emails/account-email-update.html"
	PathSignInQuick        = "html/emails/sign-in-quick.html"
	PathSignUpLink         = "html/emails/sign-up-link.html"
	PathSignUpWelcome      = "html/emails/sign-up-welcome.html" // #nosec G101
)

func SetupEmailTemplates() *EmailTemplateFiles {
	return &EmailTemplateFiles{
		AccountEmailUpdate: inittmpl.Return(&PathAccountEmailUpdate, &EmailAccountEmailUpdate),
		SignInQuickLink:    inittmpl.Return(&PathSignInQuick, &EmailSignInQuickLink),
		SignUpLink:         inittmpl.Return(&PathSignUpLink, &EmbedSignUpLink),
		SignUpWelcome:      inittmpl.Return(&PathSignUpWelcome, &EmbedSignUpWelcome),
	}
}

// revive:enable:line-length-limit
