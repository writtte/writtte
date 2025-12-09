package constants

// revive:disable:line-length-limit

const (
	ServerStarted           = "web server started successfully"
	ServerStartedFailedHTTP = "http server failed to start"
	ServerStarting          = "web server is starting"
)

const (
	DatabaseConnectionFailed   = "database connection failed"
	DatabaseConnectionStarting = "database connection is starting"
	DatabaseConnectionSuccess  = "database connection success"
)

const (
	FailedErrorRequest    = "request processing failed"
	InternalErrorRequest  = "internal server error occurred in the request"
	SuccessResultsRequest = "request processed successfully"
)

const (
	RequestLoggingStarting = "request logging is starting"
	RequestLoggingSuccess  = "request logging success"
)

const (
	SESEmailSendSuccess = "email sent successfully"
	SESEmailSendFailed  = "email failed to send"
)
