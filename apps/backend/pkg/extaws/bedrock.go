package extaws

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime/types"
)

type BedrockConfig struct {
	Region          *string
	AccessKey       *string
	SecretAccessKey *string
}

// revive:disable:line-length-limit

type BedrockClient = bedrockruntime.Client
type ConverseStreamInput = bedrockruntime.ConverseStreamInput
type ConverseStreamOutput = bedrockruntime.ConverseStreamOutput
type InferenceConfiguration = types.InferenceConfiguration
type Message = types.Message
type SystemContentBlock = types.SystemContentBlock
type SystemContentBlockMemberText = types.SystemContentBlockMemberText
type ContentBlock = types.ContentBlock
type ContentBlockMemberText = types.ContentBlockMemberText
type ConverseStreamOutputMemberContentBlockDelta = types.ConverseStreamOutputMemberContentBlockDelta
type ConverseStreamOutputMemberMetadata = types.ConverseStreamOutputMemberMetadata
type ConverseStreamOutputMemberMessageStop = types.ConverseStreamOutputMemberMessageStop
type ConverseStreamOutputMemberContentBlockStart = types.ConverseStreamOutputMemberContentBlockStart
type ConverseStreamOutputMemberContentBlockStop = types.ConverseStreamOutputMemberContentBlockStop
type ContentBlockDeltaMemberText = types.ContentBlockDeltaMemberText

// revive:enable:line-length-limit

const RoleUser = "user"

func InitBedrock(cfg BedrockConfig) *bedrockruntime.Client {
	ctx := context.Background()

	awsCfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(*cfg.Region),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				*cfg.AccessKey,
				*cfg.SecretAccessKey,
				"",
			),
		),
	)

	if err != nil {
		panic(err)
	}

	client := bedrockruntime.NewFromConfig(awsCfg)
	return client
}
