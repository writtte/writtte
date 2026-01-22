package v1aigeneratestreaming

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend/helpers/parse"
	"backend/helpers/response"
	"backend/helpers/validate"
	"backend/pkg/intstr"
)

// revive:disable:cognitive-complexity

const responseStructure = "data: %s\n\n"

type handler struct {
	serv service
}

func (h *handler) perform(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body BodyParams
	if err := parse.Body(r, &body); err != nil {
		response.Internal(w, r, nil, intstr.StrPtr(err.Error()))
		return
	}

	if !validate.Body(w, r, body) {
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	if flusher, ok := w.(http.Flusher); ok {
		flusher.Flush()
	}

	sseChannel := h.serv.perform(ctx, &body)
	streamMessage(w, sseChannel)
}

func streamMessage(w http.ResponseWriter,
	sseChannel <-chan sseMessage) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		sendSSEError(w, "streaming not supported")
		return
	}

	for msg := range sseChannel {
		if msg.Text != nil {
			_, err := fmt.Fprintf(w, responseStructure, *msg.Text)
			if err != nil {
				sendSSEError(w, fmt.Sprintf("failed to write message: %v",
					err))

				return
			}

			flusher.Flush()
		}

		if msg.Error != nil {
			sendSSEError(w, *msg.Error)
			return
		}

		if msg.InputTokens != nil && msg.OutputTokens != nil {
			finalMsg, err := json.Marshal(map[string]any{
				"inputTokens":  msg.InputTokens,
				"outputTokens": msg.OutputTokens,
			})

			if err != nil {
				sendSSEError(w,
					fmt.Sprintf("failed to marshal final message: %v", err))

				return
			}

			_, _ = fmt.Fprintf(w, responseStructure, finalMsg)

			flusher.Flush()
			return
		}
	}
}

func sendSSEError(w http.ResponseWriter, errorMsg string) {
	errorData := map[string]any{
		"error": errorMsg,
	}

	jsonMsg, err := json.Marshal(errorData)
	if err != nil {
		// revive:disable:line-length-limit
		_, _ = fmt.Fprintf(w, "data: {\"error\":\"failed to marshal error\"}\n\n")
		// revive:enable:line-length-limit
	} else {
		_, _ = fmt.Fprintf(w, responseStructure, jsonMsg)
	}

	if flusher, ok := w.(http.Flusher); ok {
		flusher.Flush()
	}
}
