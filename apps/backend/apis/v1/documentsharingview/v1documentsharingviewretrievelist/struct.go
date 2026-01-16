package v1documentsharingviewretrievelist

type QueryParams struct {
	PageCode  *string `json:"page_code" validate:"required,min=7,max=7"`
	DateRange *int    `json:"date_range" validate:"omitempty,min=1,max=31"`
}

type dbQueryInput struct {
	PageCode  *string `json:"page_code"`
	DateRange *int    `json:"date_range,omitempty"`
}

type dbQueryOutputDataDailyItem struct {
	Date        *string `json:"date"`
	Views       *int    `json:"views"`
	UniqueViews *int    `json:"unique_views"`
}

type dbQueryOutputData struct {
	PageCode       *string                       `json:"page_code"`
	DateRange      *int                          `json:"date_range"`
	StartDate      *string                       `json:"start_date"`
	EndDate        *string                       `json:"end_date"`
	DailyAnalytics []*dbQueryOutputDataDailyItem `json:"daily_analytics"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsDailyItem struct {
	Date        *string `json:"date"`
	Views       *int    `json:"views"`
	UniqueViews *int    `json:"unique_views"`
}

type apiResultsSuccess struct {
	PageCode       *string                `json:"page_code"`
	DateRange      *int                   `json:"date_range"`
	StartDate      *string                `json:"start_date"`
	EndDate        *string                `json:"end_date"`
	DailyAnalytics []*apiResultsDailyItem `json:"daily_analytics"`
}
