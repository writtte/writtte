package parseparams

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

func Body(r *http.Request, target any) error {
	var bodyBytes bytes.Buffer
	teeReader := io.TeeReader(r.Body, &bodyBytes)
	r.Body = io.NopCloser(bytes.NewReader(bodyBytes.Bytes()))

	reqBody, err := io.ReadAll(teeReader)
	if err != nil {
		return err
	}

	err = json.Unmarshal(reqBody, target)
	if err != nil {
		return err
	}

	return nil
}
