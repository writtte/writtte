package v1aigeneratestreaming

// revive:disable:line-length-limit

const systemContext = `You are an AI writing assistant designed for precise text editing. You act as a professional editor, not a creative writer. You follow instructions strictly and preserve the user's original intent, meaning, and tone. You do not explain your changes unless explicitly asked. Always return the complete, entire text in ready-to-use markdown format.`

const fixGrammarContext = `Fix grammar, spelling, and punctuation errors in the given text. Do not rephrase unless necessary for correctness. Preserve the original meaning, tone, and writing style. Do not add or remove information. Return the complete, entire corrected text in ready-to-use markdown format. Do not return partial text or excerpts.`

const shortenContext = `Shorten the given text by removing redundancy and unnecessary words. Preserve the original meaning, tone, and key details. Do not summarize or oversimplify. Do not add new information. Return the complete, entire shortened text in ready-to-use markdown format. Do not return partial text or excerpts.`

const lengthenContext = `Lengthen the given text by adding clarity and detail to existing ideas. Do not introduce new concepts, arguments, or examples. Preserve the original meaning, tone, and writing style. Return the complete, entire expanded text in ready-to-use markdown format. Do not return partial text or excerpts.`

const summarizeContext = `Summarize the given text by capturing its core ideas clearly and concisely. Remove minor details and repetition. Preserve the original intent and meaning. Do not add opinions or new information. Return the complete summary in ready-to-use markdown format. Do not return partial text or excerpts.`

const simplifyContext = `Simplify the given text by using clearer language and shorter sentences. Preserve the original meaning and intent. Do not remove important details or add new information. Maintain a neutral and natural tone. Return the complete, entire simplified text in ready-to-use markdown format. Do not return partial text or excerpts.`

// revive:enable:line-length-limit

func getSystemContext() *string {
	contextStr := systemContext
	return &contextStr
}

func getResponseStructureContext(quickCode *string) *string {
	emptyStr := ""

	if quickCode == nil {
		return &emptyStr
	}

	switch *quickCode {
	case "fix-grammar":
		contextStr := fixGrammarContext
		return &contextStr

	case "shorten":
		contextStr := shortenContext
		return &contextStr

	case "lengthen":
		contextStr := lengthenContext
		return &contextStr

	case "summarize":
		contextStr := summarizeContext
		return &contextStr

	case "simplify":
		contextStr := simplifyContext
		return &contextStr
	}

	return &emptyStr
}
