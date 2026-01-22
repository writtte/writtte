package v1aigeneratestreaming

const (
	zero = 0

	// AWS Nova 2 Lite pricing (per 1,000,000 tokens)
	// We use a scaling factor of 1,000,000 to handle dollar
	// fractions as integers.

	inputCostPerMillion  = 300  // $0.0003 * 1,000,000
	outputCostPerMillion = 2500 // $0.0025 * 1,000,000

	// Conversion factor: $1.00 = 1,000 credits

	creditsPerDollar = 1000

	// The denominator to convert "scaled dollars per million
	// tokens" down to "actual scaled dollars"

	millionTokens = 1000000
)

func calculateCredits(inputTokens, outputTokens *int) *int {
	zeroValue := zero
	if inputTokens == nil || outputTokens == nil {
		return &zeroValue
	}

	if *inputTokens <= zero && *outputTokens <= zero {
		return &zeroValue
	}

	// Calculate raw scaled cost (Tokens * PricePerMillion)
	//
	// Note: This value is effectively scaled by (1,000,000 * 1,000,000)

	rawInputCost := *inputTokens * inputCostPerMillion
	rawOutputCost := *outputTokens * outputCostPerMillion
	rawTotalCost := rawInputCost + rawOutputCost

	// Normalize to "Scaled Dollars" (scaled by 1,000,000)
	//
	// We divide by 1,000,000 because the price was "per million tokens"

	totalCostScaled := rawTotalCost / millionTokens

	// Convert Scaled Dollars to Credits
	//
	// If $1.00 (1,000,000 scaled) = 1,000 credits, we divide
	// by (1,000,000 / 1,000) = 1,000.

	divisor := millionTokens / creditsPerDollar

	credits := totalCostScaled / divisor

	// If there was a remainder in the normalization OR the
	// credit conversion, round up.

	if (rawTotalCost%millionTokens > zero) ||
		(totalCostScaled%divisor > zero) {
		credits++
	}

	return &credits
}
