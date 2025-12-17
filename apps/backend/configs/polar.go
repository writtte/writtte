package configs

import "backend/pkg/intenv"

var (
	PolarPlanProductIDSoloMonthly string
	PolarPlanProductIDSoloYearly  string
)

// revive:disable:line-length-limit

func PolarEnvs() {
	PolarPlanProductIDSoloMonthly = intenv.Load("POLAR_PLAN_PRODUCT_ID_SOLO_MONTHLY")
	PolarPlanProductIDSoloYearly = intenv.Load("POLAR_PLAN_PRODUCT_ID_SOLO_YEARLY")
}
