package apicall

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

const emptyStr = ""
const invalidHTTPStatusCode = -1

// revive:disable:line-length-limit

type APIRequest struct {
	URL         string            `json:"url"`          // The target URL for the API request
	Method      string            `json:"method"`       // HTTP method (GET, POST, etc.)
	BearerToken string            `json:"bearer_token"` // #nosec G117 Optional OAuth bearer token
	QueryParams map[string]string `json:"query_params"` // Optional URL query parameters
	Body        any               `json:"body"`         // Optional request body
	Headers     map[string]string `json:"headers"`      // Optional HTTP headers
	Timeout     time.Duration     `json:"timeout"`      // Optional request timeout
}

// revive:enable:line-length-limit

type APIResponse struct {
	StatusCode int    `json:"status_code"` // HTTP status code
	Body       string `json:"body"`        // Response body as string
	Error      error  `json:"error"`       // Error if the request failed
}

// HTTPClient wraps an http.Client with additional functionality.
type HTTPClient struct {
	client *http.Client
}

func NewHTTPClient() *HTTPClient {
	const defaultTimeout = 180

	return &HTTPClient{
		client: &http.Client{
			Timeout: defaultTimeout * time.Second,
		},
	}
}

func (h *HTTPClient) MakeAPICall(ctx context.Context,
	req APIRequest) APIResponse {
	if req.Method == emptyStr {
		req.Method = http.MethodGet
	}

	finalURL, err := buildFinalURL(req)
	if err != nil {
		return createErrorResponse(invalidHTTPStatusCode,
			"failed to build URL", err)
	}

	contentLength, httpReq, err := createHTTPRequest(ctx, req, finalURL)
	if err != nil {
		return createErrorResponse(invalidHTTPStatusCode,
			"failed to create request", err)
	}

	setHeaders(httpReq, req, contentLength)

	resp, err := h.executeRequest(httpReq, req.Timeout)
	if err != nil {
		return createErrorResponse(invalidHTTPStatusCode,
			"request failed", err)
	}

	defer func() {
		if closeErr := resp.Body.Close(); closeErr != nil {
			_ = closeErr
		}
	}()

	return processResponse(resp)
}

func buildFinalURL(req APIRequest) (string, error) {
	return buildURLWithQuery(req.URL, req.QueryParams)
}

func createHTTPRequest(ctx context.Context, req APIRequest,
	finalURL string) (*int64, *http.Request, error) {
	var bodyReader io.Reader
	var contentLength *int64

	if req.Body != nil {
		bodyBytes, err := prepareBody(req.Body)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to prepare body: %w", err)
		}

		bodyReader = bytes.NewReader(bodyBytes)

		cl := int64(len(bodyBytes))
		contentLength = &cl
	}

	request, err := http.NewRequestWithContext(ctx, req.Method,
		finalURL, bodyReader)

	return contentLength, request, err
}

func (h *HTTPClient) executeRequest(httpReq *http.Request,
	timeout time.Duration) (*http.Response, error) {
	const minTimeout = 0

	client := h.client

	if timeout > minTimeout {
		client = &http.Client{Timeout: timeout}
	}

	return client.Do(httpReq) // #nosec G704
}

func processResponse(resp *http.Response) APIResponse {
	const maxResponseSize = 100 * 1024 * 1024 // 100 MB
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxResponseSize))

	if err != nil {
		return APIResponse{
			StatusCode: resp.StatusCode,
			Body:       emptyStr,
			Error:      fmt.Errorf("failed to read response body: %w", err),
		}
	}

	return APIResponse{
		StatusCode: resp.StatusCode,
		Body:       string(body),
		Error:      nil,
	}
}

func createErrorResponse(statusCode int, message string,
	err error) APIResponse {
	return APIResponse{
		StatusCode: statusCode,
		Body:       emptyStr,
		Error:      fmt.Errorf("%s: %w", message, err),
	}
}

func buildURLWithQuery(baseURL string,
	queryParams map[string]string) (string, error) {
	const minLength = 0

	if len(queryParams) == minLength {
		return baseURL, nil
	}

	parsedURL, err := url.Parse(baseURL)
	if err != nil {
		return emptyStr, err
	}

	query := parsedURL.Query()
	for key, value := range queryParams {
		query.Add(key, value)
	}

	parsedURL.RawQuery = query.Encode()
	return parsedURL.String(), nil
}

func prepareBody(body any) ([]byte, error) {
	switch v := body.(type) {
	case string:
		return []byte(v), nil

	case []byte:
		return v, nil

	default:
		return json.Marshal(v)
	}
}

func setHeaders(req *http.Request, apiReq APIRequest, contentLength *int64) {
	req.Header.Set("Accept", "application/json")

	if apiReq.Body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	if contentLength != nil {
		req.ContentLength = *contentLength
		req.Header.Set("Content-Length", fmt.Sprintf("%d", *contentLength))
	}

	if apiReq.BearerToken != emptyStr {
		req.Header.Set("Authorization", "Bearer "+apiReq.BearerToken)
	}

	for key, value := range apiReq.Headers {
		req.Header.Set(key, value)
	}
}

func (h *HTTPClient) Get(ctx context.Context, urlPath, bearerToken string,
	queryParams map[string]string) APIResponse {
	return h.MakeAPICall(ctx, APIRequest{
		URL:         urlPath,
		Method:      http.MethodGet,
		BearerToken: bearerToken,
		QueryParams: queryParams,
	})
}

func (h *HTTPClient) Post(ctx context.Context, urlPath, bearerToken string,
	body []byte) APIResponse {
	return h.MakeAPICall(ctx, APIRequest{
		URL:         urlPath,
		Method:      http.MethodPost,
		BearerToken: bearerToken,
		Body:        body,
	})
}

func (h *HTTPClient) Patch(ctx context.Context, urlPath, bearerToken string,
	body []byte) APIResponse {
	return h.MakeAPICall(ctx, APIRequest{
		URL:         urlPath,
		Method:      http.MethodPatch,
		BearerToken: bearerToken,
		Body:        body,
	})
}

func (h *HTTPClient) Put(ctx context.Context, urlPath, bearerToken string,
	body []byte) APIResponse {
	return h.MakeAPICall(ctx, APIRequest{
		URL:         urlPath,
		Method:      http.MethodPut,
		BearerToken: bearerToken,
		Body:        body,
	})
}

func (h *HTTPClient) Delete(ctx context.Context, urlPath,
	bearerToken string) APIResponse {
	return h.MakeAPICall(ctx, APIRequest{
		URL:         urlPath,
		Method:      http.MethodDelete,
		BearerToken: bearerToken,
	})
}
