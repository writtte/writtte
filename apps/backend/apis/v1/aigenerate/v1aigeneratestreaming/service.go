package v1aigeneratestreaming

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"backend/apis/v1/authentication/v1signin"
	"backend/cmd/glob"
	"backend/constants"
	"backend/pkg/extjwt"
	"backend/pkg/intstr"
)

// revive:disable:cognitive-complexity
// revive:disable:cyclomatic

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context, body *BodyParams,
) <-chan sseMessage {
	const messageBuffer = 10
	const fiveMinutes = 5

	sseChannel := make(chan sseMessage, messageBuffer)

	timeout := fiveMinutes * time.Minute
	ctx, cancel := context.WithTimeout(ctx, timeout)

	go func() {
		defer cancel()
		s.processStream(ctx, body, sseChannel)
	}()

	return sseChannel
}

func (s *service) processStream(ctx context.Context, body *BodyParams,
	sseChannel chan<- sseMessage) {
	defer close(sseChannel)

	bedrockClient := glob.Config.AWSBedrockClient

	config, err := s.returnNovaLiteConfigs(ctx, body.StyleCode,
		body.Quick)

	if err != nil {
		sseChannel <- sseMessage{
			Error: intstr.StrPtr(fmt.Sprintf("failed to get config: %v",
				err)),
		}

		return
	}

	stream, err := callBedrockStreaming(ctx, bedrockClient, body, config)

	if err != nil {
		sseChannel <- sseMessage{
			Error: intstr.StrPtr(fmt.Sprintf("failed to call bedrock: %v",
				err)),
		}

		return
	}

	totalInputTokens, totalOutputTokens, err := processStreamingResults(ctx,
		&stream, sseChannel)

	if err != nil {
		sseChannel <- sseMessage{
			Error: intstr.StrPtr(fmt.Sprintf("failed to process stream: %v",
				err)),
		}

		return
	}

	if totalInputTokens == nil || totalOutputTokens == nil {
		sseChannel <- sseMessage{
			Error: intstr.StrPtr("token counts are nil"),
		}

		return
	}

	s.finalizeStreamWithCredits(ctx, totalInputTokens, totalOutputTokens,
		sseChannel)
}

func (s *service) finalizeStreamWithCredits(ctx context.Context,
	totalInputTokens, totalOutputTokens *int, sseChannel chan<- sseMessage) {
	usedCredits := calculateCredits(totalInputTokens,
		totalOutputTokens)

	dbOutput, err := s.updateUserCredits(ctx, usedCredits)
	if err != nil {
		sseChannel <- sseMessage{
			Error: intstr.StrPtr(fmt.Sprintf("failed to update credits: %v",
				err)),
		}

		return
	}

	if dbOutput == nil || dbOutput.Status == nil || !*dbOutput.Status {
		errorMsg := "failed to update user credits"
		if dbOutput != nil && dbOutput.Message != nil {
			errorMsg = *dbOutput.Message
		}

		sseChannel <- sseMessage{
			Error: intstr.StrPtr(errorMsg),
		}

		return
	}

	sseChannel <- sseMessage{
		InputTokens:  totalInputTokens,
		OutputTokens: totalOutputTokens,
	}
}

func (s *service) updateUserCredits(ctx context.Context,
	creditAmount *int) (*dbQueryOutput, error) {
	claimsValue := ctx.Value(constants.JWTKey)
	if claimsValue == nil {
		return nil, fmt.Errorf("JWT claims not found in context")
	}

	claims, ok := claimsValue.(extjwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid JWT claims type")
	}

	accountCodeValue, exists := claims[v1signin.ClaimAccountCode]
	if !exists {
		return nil, fmt.Errorf("account code not found in JWT claims")
	}

	accountCode, ok := accountCodeValue.(string)
	if !ok {
		return nil, fmt.Errorf("account code is not a string")
	}

	input := dbQueryInput{
		AccountCode:      &accountCode,
		UsedCreditAmount: creditAmount,
	}

	results, err := s.repo.perform(ctx, &input)
	if err != nil {
		return nil, err
	}

	var parsedResults *dbQueryOutput
	if err := json.Unmarshal([]byte(*results), &parsedResults); err != nil {
		return nil, err
	}

	return parsedResults, nil
}
