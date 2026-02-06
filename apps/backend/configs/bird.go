package configs

import "backend/pkg/intenv"

var (
	BirdAPIKey      string
	BirdWorkspaceID string
	BirdSender      string
	BirdRegion      string
)

func BirdEnvs() {
	BirdAPIKey = intenv.Load("BE_BIRD_API_KEY")
	BirdWorkspaceID = intenv.Load("BE_BIRD_WORKSPACE_ID")
	BirdSender = intenv.Load("BE_BIRD_SENDER")
	BirdRegion = intenv.Load("BE_BIRD_REGION")
}
