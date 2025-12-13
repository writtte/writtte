package extgolog

import (
	"github.com/tvative/golog"
)

type GoLog struct {
	instance *golog.Config
}

type Config struct {
	Destination string // Path where log files will be stored
	Rotation    string // Number of log files to keep before rotation
}

type LogType int

type Logger interface {
	Log(jsonContent map[string]any, messageContent ...any)
	Success(jsonContent map[string]any, messageContent ...any)
	Error(jsonContent map[string]any, messageContent ...any)
	Warning(jsonContent map[string]any, messageContent ...any)
	Debug(jsonContent map[string]any, messageContent ...any)
	Information(jsonContent map[string]any, messageContent ...any)
	Fatal(jsonContent map[string]any, messageContent ...any)
}

const (
	TypeLog         LogType = iota // Normal log level
	TypeSuccess                    // Success log level
	TypeError                      // Error log level
	TypeWarning                    // Warning log level
	TypeDebug                      // Debug log level
	TypeInformation                // Information log level
	TypeFatal                      // Fatal error log level
)

func InitLogger(cfg Config) *GoLog {
	logFilePrefix := "/log"
	defRotation := setLogRotation(cfg.Rotation)

	tempInstance := golog.Initialize()
	tempInstance.SetFileOutput(cfg.Destination + logFilePrefix)
	tempInstance.SetLogRotateByCount(int64(defRotation))
	tempInstance.SetTerminalOutput(true)
	tempInstance.SetFileFormat(golog.JSONFormat)
	tempInstance.SetTerminalFormat(golog.ReadableFormat)

	return &GoLog{instance: tempInstance}
}

func (l *GoLog) Log(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.NormalLog, jsonContent, messageContent...)
}

func (l *GoLog) Success(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.SuccessLog, jsonContent, messageContent...)
}

func (l *GoLog) Error(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.ErrorLog, jsonContent, messageContent...)
}

func (l *GoLog) Warning(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.WarningLog, jsonContent, messageContent...)
}

func (l *GoLog) Debug(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.DebugLog, jsonContent, messageContent...)
}

func (l *GoLog) Information(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.InfoLog, jsonContent, messageContent...)
}

func (l *GoLog) Fatal(jsonContent map[string]any,
	messageContent ...any) {
	l.instance.Log(golog.ErrorLog, jsonContent, messageContent...)

	panic(messageContent)
}
