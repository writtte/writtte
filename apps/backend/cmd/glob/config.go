package glob

import (
	"net/http"

	"github.com/go-playground/validator/v10"

	"backend/embeds"
	"backend/pkg/extaws"
	extgolog "backend/pkg/extlog"
	"backend/pkg/extpgx"
)

type GlobalConfiguration struct {
	Environment                       int
	RunningMode                       int
	HTTPHandler                       http.Handler
	MainSQLDB                         *extpgx.PsqlPool
	Logger                            *extgolog.GoLog
	Validator                         *validator.Validate
	AWSSESConfig                      *extaws.AWSSESConfig
	AWSSESSession                     *extaws.AWSSESSession
	AWSS3PrivateGeneralBucketClient   *extaws.S3Client
	AWSS3PrivateDirectoryBucketClient *extaws.S3Client
	AWSBedrockClient                  *extaws.BedrockClient
	EmailTemplates                    *embeds.EmailTemplateFiles
	RateLimit                         bool
	UseLocalSESInLocalEnv             bool
}

var Config *GlobalConfiguration
