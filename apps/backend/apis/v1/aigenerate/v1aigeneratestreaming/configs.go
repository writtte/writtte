package v1aigeneratestreaming

import (
	"context"

	"backend/configs"
)

const maxTokens2048 = 10000
const defaultTemperature = 0.8

func (s *service) returnNovaLiteConfigs(ctx context.Context,
	styleCode *string, quickCode *string) (*bedrockAPIConfig, error) {
	maxTokens := int32(maxTokens2048)
	temperature := float32(defaultTemperature)

	styleContent, err := s.getStyleByCode(ctx, styleCode)
	if err != nil {
		return nil, err
	}

	return &bedrockAPIConfig{
		ModalID:                  &configs.AWSBedrockModelIDNovaLite,
		MaxTokens:                &maxTokens,
		Temperature:              &temperature,
		SystemContext:            getSystemContext(quickCode),
		ResponseStructureContext: getResponseStructureContext(quickCode),
		StyleContext:             styleContent,
	}, nil
}
