package v1polarsubscriptionrevoked

// revive:disable:line-length-limit
// revive:disable:nested-structs

// https://polar.sh/docs/api-reference/webhooks/subscription.revoked

type BodyParams struct {
	Type      *string `json:"type"`
	Timestamp *string `json:"timestamp"`
	Data      *struct {
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
		Metadata                    map[string]any `json:"metadata"`
		Customer                    *struct {
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
		Product *struct {
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
			Metadata               map[string]any `json:"metadata"`
			Prices                 []*struct {
				CreatedAt         *string `json:"created_at"`
				ModifiedAt        *string `json:"modified_at"`
				ID                *string `json:"id"`
				Source            *string `json:"source"`
				AmountType        *string `json:"amount_type"`
				IsArchived        *bool   `json:"is_archived"`
				ProductID         *string `json:"product_id"`
				Type              *string `json:"type"`
				RecurringInterval *string `json:"recurring_interval"`
				PriceCurrency     *string `json:"price_currency"`
				PriceAmount       *int    `json:"price_amount"`
				Legacy            *bool   `json:"legacy"`
			} `json:"prices"`
			Benefits []*struct {
				ID             *string        `json:"id"`
				CreatedAt      *string        `json:"created_at"`
				ModifiedAt     *string        `json:"modified_at"`
				Type           *string        `json:"type"`
				Description    *string        `json:"description"`
				Selectable     *bool          `json:"selectable"`
				Deletable      *bool          `json:"deletable"`
				OrganizationID *string        `json:"organization_id"`
				Metadata       map[string]any `json:"metadata"`
				Properties     *struct {
					Note *string `json:"note"`
				} `json:"properties"`
			} `json:"benefits"`
			Medias []*struct {
				ID                   *string `json:"id"`
				OrganizationID       *string `json:"organization_id"`
				Name                 *string `json:"name"`
				Path                 *string `json:"path"`
				MimeType             *string `json:"mime_type"`
				Size                 *int    `json:"size"`
				StorageVersion       *string `json:"storage_version"`
				ChecksumEtag         *string `json:"checksum_etag"`
				ChecksumSha256Base64 *string `json:"checksum_sha256_base64"`
				ChecksumSha256Hex    *string `json:"checksum_sha256_hex"`
				LastModifiedAt       *string `json:"last_modified_at"`
				Version              *string `json:"version"`
				Service              *string `json:"service"`
				IsUploaded           *bool   `json:"is_uploaded"`
				CreatedAt            *string `json:"created_at"`
				SizeReadable         *string `json:"size_readable"`
				PublicURL            *string `json:"public_url"`
			} `json:"medias"`
			AttachedCustomFields []*struct {
				CustomFieldID *string `json:"custom_field_id"`
				CustomField   *struct {
					CreatedAt      *string        `json:"created_at"`
					ModifiedAt     *string        `json:"modified_at"`
					ID             *string        `json:"id"`
					Metadata       map[string]any `json:"metadata"`
					Type           *string        `json:"type"`
					Slug           *string        `json:"slug"`
					Name           *string        `json:"name"`
					OrganizationID *string        `json:"organization_id"`
					Properties     *struct {
						FormLabel       *string `json:"form_label"`
						FormHelpText    *string `json:"form_help_text"`
						FormPlaceholder *string `json:"form_placeholder"`
						Textarea        *bool   `json:"textarea"`
						MinLength       *int    `json:"min_length"`
						MaxLength       *int    `json:"max_length"`
					} `json:"properties"`
				} `json:"custom_field"`
				Order    *int  `json:"order"`
				Required *bool `json:"required"`
			} `json:"attached_custom_fields"`
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
		Prices []*struct {
			CreatedAt         *string `json:"created_at"`
			ModifiedAt        *string `json:"modified_at"`
			ID                *string `json:"id"`
			Source            *string `json:"source"`
			AmountType        *string `json:"amount_type"`
			IsArchived        *bool   `json:"is_archived"`
			ProductID         *string `json:"product_id"`
			Type              *string `json:"type"`
			RecurringInterval *string `json:"recurring_interval"`
			PriceCurrency     *string `json:"price_currency"`
			PriceAmount       *int    `json:"price_amount"`
			Legacy            *bool   `json:"legacy"`
		} `json:"prices"`
		Meters []*struct {
			CreatedAt     *string `json:"created_at"`
			ModifiedAt    *string `json:"modified_at"`
			ID            *string `json:"id"`
			ConsumedUnits *int    `json:"consumed_units"`
			CreditedUnits *int    `json:"credited_units"`
			Amount        *int    `json:"amount"`
			MeterID       *string `json:"meter_id"`
			Meter         *struct {
				Metadata   map[string]any `json:"metadata"`
				CreatedAt  *string        `json:"created_at"`
				ModifiedAt *string        `json:"modified_at"`
				ID         *string        `json:"id"`
				Name       *string        `json:"name"`
				Filter     *struct {
					Conjunction *string `json:"conjunction"`
					Clauses     []*struct {
						Property *string `json:"property"`
						Operator *string `json:"operator"`
						Value    *string `json:"value"`
					} `json:"clauses"`
				} `json:"filter"`
				Aggregation *struct {
					Func *string `json:"func"`
				} `json:"aggregation"`
				OrganizationID *string `json:"organization_id"`
				ArchivedAt     *string `json:"archived_at"`
			} `json:"meter"`
		} `json:"meters"`
		Seats           *int           `json:"seats"`
		CustomFieldData map[string]any `json:"custom_field_data"`
	} `json:"data"`
}

// revive:enable:nested-structs
// revive:enable:line-length-limit

type dbQueryInput struct {
	CustomerID  *string
	SeatCount   *int
	Service     *string
	ServiceData map[string]any
	Status      *string
}

type dbQueryOutput struct {
	Status     *bool   `json:"status"`
	Code       *string `json:"code"`
	Message    *string `json:"message"`
	Additional *string `json:"additional"`
	Data       *any    `json:"data"`
}
