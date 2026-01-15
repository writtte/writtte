package v1documentsharingviewcreate

import (
	"context"
	"encoding/json"
	"time"

	"backend/pkg/intstr"
)

type service struct {
	repo repository
}

func (s *service) perform(ctx context.Context,
	body *BodyParams) (*dbQueryOutput, error) {
	input := dbQueryInput{
		PageCode:    body.PageCode,
		VisitorID:   body.VisitorID,
		CurrentDate: intstr.StrPtr(time.Now().Format("2006-01-02")),
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
