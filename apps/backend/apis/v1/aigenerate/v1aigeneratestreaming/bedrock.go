package v1aigeneratestreaming

import (
	"context"
	"fmt"

	"backend/pkg/extaws"
)

// revive:disable:cognitive-complexity
// revive:disable:cyclomatic

const emptyStr = ""

type bedrockAPIConfig struct {
	ModalID                  *string
	SystemContext            *string
	ResponseStructureContext *string
	StyleContext             *string
	MaxTokens                *int32
	Temperature              *float32
}

func callBedrockStreaming(ctx context.Context,
	client *extaws.BedrockClient, body *BodyParams,
	inputConfig *bedrockAPIConfig,
) (output extaws.ConverseStreamOutput, err error) {
	streamInput := &extaws.ConverseStreamInput{
		ModelId: inputConfig.ModalID,
		Messages: []extaws.Message{
			{
				Role: extaws.RoleUser,
				Content: []extaws.ContentBlock{
					&extaws.ContentBlockMemberText{
						Value: *body.Message,
					},
				},
			},
		},
		InferenceConfig: &extaws.InferenceConfiguration{
			MaxTokens:   inputConfig.MaxTokens,
			Temperature: inputConfig.Temperature,
		},
	}

	var systemBlocks []extaws.SystemContentBlock

	if inputConfig.SystemContext != nil &&
		*inputConfig.SystemContext != emptyStr {
		systemBlocks = append(systemBlocks,
			&extaws.SystemContentBlockMemberText{
				Value: *inputConfig.SystemContext,
			})
	}

	if inputConfig.StyleContext != nil &&
		*inputConfig.StyleContext != emptyStr {
		systemBlocks = append(systemBlocks,
			&extaws.SystemContentBlockMemberText{
				Value: *inputConfig.StyleContext,
			})
	}

	if inputConfig.ResponseStructureContext != nil &&
		*inputConfig.ResponseStructureContext != emptyStr {
		systemBlocks = append(systemBlocks,
			&extaws.SystemContentBlockMemberText{
				Value: *inputConfig.ResponseStructureContext,
			})
	}

	const minBlocks = 0

	if len(systemBlocks) > minBlocks {
		streamInput.System = systemBlocks
	}

	streamOutput, err := client.ConverseStream(ctx, streamInput)
	if err != nil {
		return extaws.ConverseStreamOutput{}, err
	}

	if streamOutput == nil {
		return extaws.ConverseStreamOutput{}, fmt.Errorf("stream output is nil")
	}

	return *streamOutput, nil
}

func processStreamingResults(ctx context.Context,
	streamingOutput *extaws.ConverseStreamOutput,
	sseChannel chan<- sseMessage) (inputTokens, outputTokens *int, err error) {
	const defaultTokenCount = 0

	totalInputTokens := defaultTokenCount
	totalOutputTokens := defaultTokenCount

	eventStream := streamingOutput.GetStream()

EventLoop:
	for event := range eventStream.Events() {
		select {
		case <-ctx.Done():
			return &totalInputTokens, &totalOutputTokens, ctx.Err()

		default:
		}

		switch e := event.(type) {
		case *extaws.ConverseStreamOutputMemberContentBlockDelta:
			if delta := e.Value.Delta; delta != nil {
				if textDelta, ok :=
					delta.(*extaws.ContentBlockDeltaMemberText); ok {
					text := textDelta.Value

					sseChannel <- sseMessage{
						Text: &text,
					}
				}
			}

		case *extaws.ConverseStreamOutputMemberMetadata:
			if usage := e.Value.Usage; usage != nil {
				if usage.InputTokens != nil {
					totalInputTokens = int(*usage.InputTokens)
				}

				if usage.OutputTokens != nil {
					totalOutputTokens = int(*usage.OutputTokens)
				}
			}

		case *extaws.ConverseStreamOutputMemberMessageStop:
			break EventLoop

		case *extaws.ConverseStreamOutputMemberContentBlockStart,
			*extaws.ConverseStreamOutputMemberContentBlockStop:
			continue
		}
	}

	if err := eventStream.Err(); err != nil {
		return nil, nil, err
	}

	_ = eventStream.Close()

	return &totalInputTokens, &totalOutputTokens, nil
}
