package v1documentversionretrieve

import (
	"context"
)

type service struct{}

func (s *service) perform(ctx context.Context, // revive:disable-line
	queries *QueryParams) (*string, error) {
	content, err := getVersionDocumentContent(ctx, queries.DocumentCode,
		queries.VersionCode)

	return content.Body, err
}
