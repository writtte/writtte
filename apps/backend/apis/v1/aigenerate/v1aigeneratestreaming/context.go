package v1aigeneratestreaming

// revive:disable:line-length-limit

const systemContext = `You are an AI writing assistant designed for precise text editing. You act as a professional editor, not a creative writer. You follow instructions strictly and preserve the user's original intent, meaning, and tone. Return ONLY the edited text in markdown format. Do not include any preambles, explanations, greetings, or phrases like "Here is" or "Certainly". Output the text directly without any introductory statements. CRITICAL: Never repeat or quote the original input text before providing your edits. Output ONLY the final edited version.`

const fixGrammarContext = `Fix grammar, spelling, and punctuation errors in the given text. Do not rephrase unless necessary for correctness. Preserve the original meaning, tone, and writing style. Do not add or remove information. Return ONLY the complete corrected text in markdown format without any preamble, introduction, or explanatory text. Start directly with the corrected content.`

const shortenContext = `Shorten the given text by removing redundancy and unnecessary words. Preserve the original meaning, tone, and key details. Do not summarize or oversimplify. Do not add new information. Return ONLY the complete shortened text in markdown format without any preamble, introduction, or explanatory text. Start directly with the shortened content.`

const lengthenContext = `Lengthen the given text by adding clarity and detail to existing ideas. Do not introduce new concepts, arguments, or examples. Preserve the original meaning, tone, and writing style. Return ONLY the complete expanded text in markdown format without any preamble, introduction, or explanatory text. Start directly with the expanded content.`

const summarizeContext = `Summarize the given text by capturing its core ideas clearly and concisely. Remove minor details and repetition. Preserve the original intent and meaning. Do not add opinions or new information. Return ONLY the complete summary in markdown format without any preamble, introduction, or explanatory text. Start directly with the summary content.`

const simplifyContext = `Simplify the given text by using clearer language and shorter sentences. Preserve the original meaning and intent. Do not remove important details or add new information. Maintain a neutral and natural tone. Return ONLY the complete simplified text in markdown format without any preamble, introduction, or explanatory text. Start directly with the simplified content.`

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
