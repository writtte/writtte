package configs

import "backend/pkg/intenv"

var (
	PolarAPIURL                   string
	PolarOrganizationAccessToken  string
	PolarPlanProductIDSoloMonthly string
	PolarPlanProductIDSoloYearly  string
)

// revive:disable:line-length-limit

func PolarEnvs() {
	PolarAPIURL = intenv.Load("POLAR_API_URL")
	PolarOrganizationAccessToken = intenv.Load("POLAR_ORGANIZATION_ACCESS_TOKEN")
	PolarPlanProductIDSoloMonthly = intenv.Load("POLAR_PLAN_PRODUCT_ID_SOLO_MONTHLY")
	PolarPlanProductIDSoloYearly = intenv.Load("POLAR_PLAN_PRODUCT_ID_SOLO_YEARLY")
}
