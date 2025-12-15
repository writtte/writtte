package dbconvert

import "fmt"

const itemErrorMsg = "invalid value %s identified"

func ItemLifecycleStateToExport(value *string) string {
	switch *value {
	case "ACTIVE":
		return "active"

	case "DELETED":
		return "deleted"

	default:
		panic(fmt.Sprintf(itemErrorMsg, *value))
	}
}

func ItemWorkflowStateToExport(value *string) string {
	switch *value {
	case "PUBLISHED":
		return "published"

	default:
		panic(fmt.Sprintf(itemErrorMsg, *value))
	}
}

func ItemLifecycleStateToDB(value *string) string {
	switch *value {
	case "active":
		return "ACTIVE"

	case "deleted":
		return "DELETED"

	default:
		panic(fmt.Sprintf(itemErrorMsg, *value))
	}
}

func ItemWorkflowStateToDB(value *string) string {
	switch *value {
	case "published":
		return "PUBLISHED"

	default:
		panic(fmt.Sprintf(itemErrorMsg, *value))
	}
}
