package v1accountoverview

import "encoding/json"

type dbQueryInput struct {
	AccountCode *string
}

type dbQueryOutputDataSubscription struct {
	CustomerID  *string          `json:"customer_id"`
	SeatCount   *int             `json:"seat_count"`
	Service     *string          `json:"service"`
	ServiceData *json.RawMessage `json:"service_data"`
	Status      *string          `json:"status"`
	CreatedTime *string          `json:"created_time"`
	UpdatedTime *string          `json:"updated_time"`
}

type dbQueryOutputDataUser struct {
	AccountCode     *string `json:"account_code"`
	EmailAddress    *string `json:"email_address"`
	Name            *string `json:"name"`
	Status          *string `json:"status"`
	IsEmailVerified *bool   `json:"is_email_verified"`
	UpdatedTime     *string `json:"updated_time"`
}

type dbQueryOutputData struct {
	Subscription *dbQueryOutputDataSubscription `json:"subscription"`
	User         *dbQueryOutputDataUser         `json:"user"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	AccountCode        *string `json:"account_code"`
	EmailAddress       *string `json:"email_address"`
	Name               *string `json:"name"`
	Status             *string `json:"status"`
	SubscriptionStatus *string `json:"subscription_status"`
	IsEmailVerified    *bool   `json:"is_email_verified"`
	UpdatedTime        *string `json:"updated_time"`
}
