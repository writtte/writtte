package v1polarorderpaid

// revive:disable:line-length-limit
// revive:disable:nested-structs

// https://polar.sh/docs/api-reference/webhooks/order.paid

type BodyParams struct {
	Type      *string `json:"type"`
	Timestamp *string `json:"timestamp"`
	Data      *struct {
		ID                   *string `json:"id"`
		CreatedAt            *string `json:"created_at"`
		ModifiedAt           *string `json:"modified_at"`
		Status               *string `json:"status"`
		Paid                 *bool   `json:"paid"`
		SubtotalAmount       *int    `json:"subtotal_amount"`
		DiscountAmount       *int    `json:"discount_amount"`
		NetAmount            *int    `json:"net_amount"`
		TaxAmount            *int    `json:"tax_amount"`
		TotalAmount          *int    `json:"total_amount"`
		AppliedBalanceAmount *int    `json:"applied_balance_amount"`
		DueAmount            *int    `json:"due_amount"`
		RefundedAmount       *int    `json:"refunded_amount"`
		RefundedTaxAmount    *int    `json:"refunded_tax_amount"`
		Currency             *string `json:"currency"`
		BillingReason        *string `json:"billing_reason"`
		BillingName          *string `json:"billing_name"`
		BillingAddress       *struct {
			Country    *string `json:"country"`
			Line1      *string `json:"line1"`
			Line2      *string `json:"line2"`
			PostalCode *string `json:"postal_code"`
			City       *string `json:"city"`
			State      *string `json:"state"`
		} `json:"billing_address"`
		InvoiceNumber      *string        `json:"invoice_number"`
		IsInvoiceGenerated *bool          `json:"is_invoice_generated"`
		CustomerID         *string        `json:"customer_id"`
		ProductID          *string        `json:"product_id"`
		DiscountID         *string        `json:"discount_id"`
		SubscriptionID     *string        `json:"subscription_id"`
		CheckoutID         *string        `json:"checkout_id"`
		Metadata           map[string]any `json:"metadata"`
		PlatformFeeAmount  *int           `json:"platform_fee_amount"`
		Customer           *struct {
			ID             *string        `json:"id"`
			CreatedAt      *string        `json:"created_at"`
			ModifiedAt     *string        `json:"modified_at"`
			Metadata       map[string]any `json:"metadata"`
			ExternalID     *string        `json:"external_id"`
			Email          *string        `json:"email"`
			EmailVerified  *bool          `json:"email_verified"`
			Name           *string        `json:"name"`
			BillingAddress *struct {
				Country    *string `json:"country"`
				Line1      *string `json:"line1"`
				Line2      *string `json:"line2"`
				PostalCode *string `json:"postal_code"`
				City       *string `json:"city"`
				State      *string `json:"state"`
			} `json:"billing_address"`
			TaxID          []*string `json:"tax_id"`
			OrganizationID *string   `json:"organization_id"`
			DeletedAt      *string   `json:"deleted_at"`
			AvatarURL      *string   `json:"avatar_url"`
		} `json:"customer"`
		UserID  *string `json:"user_id"`
		Product *struct {
			Metadata               map[string]any `json:"metadata"`
			ID                     *string        `json:"id"`
			CreatedAt              *string        `json:"created_at"`
			ModifiedAt             *string        `json:"modified_at"`
			TrialInterval          *string        `json:"trial_interval"`
			TrialIntervalCount     *int           `json:"trial_interval_count"`
			Name                   *string        `json:"name"`
			Description            *string        `json:"description"`
			RecurringInterval      *string        `json:"recurring_interval"`
			RecurringIntervalCount *int           `json:"recurring_interval_count"`
			IsRecurring            *bool          `json:"is_recurring"`
			IsArchived             *bool          `json:"is_archived"`
			OrganizationID         *string        `json:"organization_id"`
		} `json:"product"`
		Discount *struct {
			Duration         *string        `json:"duration"`
			Type             *string        `json:"type"`
			Amount           *int           `json:"amount"`
			Currency         *string        `json:"currency"`
			CreatedAt        *string        `json:"created_at"`
			ModifiedAt       *string        `json:"modified_at"`
			ID               *string        `json:"id"`
			Metadata         map[string]any `json:"metadata"`
			Name             *string        `json:"name"`
			Code             *string        `json:"code"`
			StartsAt         *string        `json:"starts_at"`
			EndsAt           *string        `json:"ends_at"`
			MaxRedemptions   *int           `json:"max_redemptions"`
			RedemptionsCount *int           `json:"redemptions_count"`
			OrganizationID   *string        `json:"organization_id"`
		} `json:"discount"`
		Subscription *struct {
			Metadata                    map[string]any `json:"metadata"`
			CreatedAt                   *string        `json:"created_at"`
			ModifiedAt                  *string        `json:"modified_at"`
			ID                          *string        `json:"id"`
			Amount                      *int           `json:"amount"`
			Currency                    *string        `json:"currency"`
			RecurringInterval           *string        `json:"recurring_interval"`
			RecurringIntervalCount      *int           `json:"recurring_interval_count"`
			Status                      *string        `json:"status"`
			CurrentPeriodStart          *string        `json:"current_period_start"`
			CurrentPeriodEnd            *string        `json:"current_period_end"`
			TrialStart                  *string        `json:"trial_start"`
			TrialEnd                    *string        `json:"trial_end"`
			CancelAtPeriodEnd           *bool          `json:"cancel_at_period_end"`
			CanceledAt                  *string        `json:"canceled_at"`
			StartedAt                   *string        `json:"started_at"`
			EndsAt                      *string        `json:"ends_at"`
			EndedAt                     *string        `json:"ended_at"`
			CustomerID                  *string        `json:"customer_id"`
			ProductID                   *string        `json:"product_id"`
			DiscountID                  *string        `json:"discount_id"`
			CheckoutID                  *string        `json:"checkout_id"`
			CustomerCancellationReason  *string        `json:"customer_cancellation_reason"`
			CustomerCancellationComment *string        `json:"customer_cancellation_comment"`
			Seats                       *int           `json:"seats"`
		} `json:"subscription"`
		Items []*struct {
			CreatedAt      *string `json:"created_at"`
			ModifiedAt     *string `json:"modified_at"`
			ID             *string `json:"id"`
			Label          *string `json:"label"`
			Amount         *int    `json:"amount"`
			TaxAmount      *int    `json:"tax_amount"`
			Proration      *bool   `json:"proration"`
			ProductPriceID *string `json:"product_price_id"`
		} `json:"items"`
		Description     *string        `json:"description"`
		Seats           *int           `json:"seats"`
		CustomFieldData map[string]any `json:"custom_field_data"`
	} `json:"data"`
}

// revive:enable:nested-structs
// revive:enable:line-length-limit

type dbQueryInput struct {
	AccountCode              *string
	CustomerID               *string
	SeatCount                *int
	Service                  *string
	ServiceData              map[string]any
	Status                   *string
	SubscriptionCreditAmount *float64
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
