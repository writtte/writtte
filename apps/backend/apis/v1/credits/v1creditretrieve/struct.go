package v1creditretrieve

type dbQueryInput struct {
	AccountCode *string
}

type dbCreditData struct {
	CreditAmount    *float64 `json:"credit_amount"`
	AllocatedAmount *float64 `json:"allocated_amount"`
	CreatedTime     *string  `json:"created_time"`
	UpdatedTime     *string  `json:"updated_time"`
}

type dbQueryOutputData struct {
	Subscription      *dbCreditData `json:"subscription"`
	Manual            *dbCreditData `json:"manual"`
	TotalCreditAmount *float64      `json:"total_credit_amount"`
}

type dbQueryOutput struct {
	Status     *bool              `json:"status"`
	Code       *string            `json:"code"`
	Message    *string            `json:"message"`
	Additional *string            `json:"additional"`
	Data       *dbQueryOutputData `json:"data"`
}

type apiResultsSuccess struct {
	Subscription      *dbCreditData `json:"subscription"`
	Manual            *dbCreditData `json:"manual"`
	TotalCreditAmount *string       `json:"total_credit_amount"`
}
