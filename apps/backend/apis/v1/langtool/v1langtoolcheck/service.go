package v1langtoolcheck

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"backend/configs"
)

type service struct {
	httpClient *http.Client
}

type languageToolService interface {
	checkText(ctx context.Context,
		requestData map[string]any) (map[string]any, error)
}

const maximumTimeoutInSeconds = 30

func newService() *service {
	return &service{
		httpClient: &http.Client{
			Timeout: maximumTimeoutInSeconds * time.Second,
		},
	}
}

func (s *service) checkText(ctx context.Context,
	requestData map[string]any) (map[string]any, error) {
	req, err := prepareRequest(ctx, requestData)
	if err != nil {
		return nil, err
	}

	resp, err := s.sendRequest(req)
	if err != nil {
		return nil, err
	}

	defer closeResponseBody(resp)

	return processResponse(resp)
}

func prepareRequest(ctx context.Context, requestData map[string]any,
) (*http.Request, error) {
	baseURL := configs.LangToolAPIURL + "/v2/check"

	if requestData["language"] == "auto" {
		requestData["language"] = "en-US"
	}

	formData := url.Values{}
	for key, value := range requestData {
		formData.Set(key, fmt.Sprintf("%v", value))
	}

	encodedData := formData.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost,
		baseURL, bytes.NewBufferString(encodedData))

	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	return req, nil
}

func (s *service) sendRequest(req *http.Request,
) (*http.Response, error) {
	resp, err := s.httpClient.Do(req) // #nosec G704
	if err != nil {
		return nil,
			fmt.Errorf("error sending request to Language Tool API: %w", err)
	}

	return resp, nil
}

func closeResponseBody(resp *http.Response) {
	if err := resp.Body.Close(); err != nil {
		_, _ = fmt.Printf("error closing response body: %v", err)
	}
}

func processResponse(resp *http.Response) (map[string]any, error) {
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		// revive:disable:line-length-limit

		return nil, fmt.Errorf("unexpected status code from Language Tool API: %d, body: %s",
			resp.StatusCode, responseBody)

		// revive:enable:line-length-limit
	}

	var response map[string]any
	if err := json.Unmarshal(responseBody, &response); err != nil {
		return nil, fmt.Errorf("error unmarshaling response: %w", err)
	}

	return response, nil
}
