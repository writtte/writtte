package parseparams

import (
	"encoding/json"
	"net/http"
	"reflect"
	"strconv"
	"strings"
)

const zero = 0

const emptyStr = ""

func Queries(r *http.Request, target any) error {
	_, targetElem, err := validateQueryTarget(target)
	if err != nil {
		return err
	}

	params := r.URL.Query()
	targetType := targetElem.Type()

	for i := zero; i < targetType.NumField(); i++ {
		field := targetType.Field(i)
		paramName := getParamNameFromTag(field)
		if paramName == emptyStr {
			continue
		}

		paramValues, exists := params[paramName]
		if !exists || len(paramValues) == zero {
			continue
		}

		setFieldValue(targetElem.Field(i), field.Type,
			paramValues[zero])
	}

	return nil
}

func validateQueryTarget(target any) (targetValue reflect.Value,
	targetElement reflect.Value, err error) {
	targetVal := reflect.ValueOf(target)
	if targetVal.Kind() != reflect.Ptr || targetVal.IsNil() {
		return reflect.Value{}, reflect.Value{},
			&json.InvalidUnmarshalError{Type: reflect.TypeOf(target)}
	}

	return targetVal, targetVal.Elem(), nil
}

func getParamNameFromTag(field reflect.StructField) string {
	jsonTag := field.Tag.Get("json")
	if jsonTag == emptyStr {
		return emptyStr
	}

	return strings.Split(jsonTag, ",")[zero]
}

func setFieldValue(fieldVal reflect.Value, fieldType reflect.Type,
	valueStr string) {
	if !fieldVal.CanSet() {
		return
	}

	if fieldType.Kind() == reflect.Pointer {
		setPointerValue(fieldVal, fieldType, valueStr)
		return
	}

	switch fieldType.Kind() {
	case reflect.Int:
		setIntValue(fieldVal, valueStr)

	case reflect.String:
		fieldVal.SetString(valueStr)

	case reflect.Bool:
		setBoolValue(fieldVal, valueStr)
	}
}

func setIntValue(fieldVal reflect.Value, valueStr string) {
	if valueStr == emptyStr {
		return
	}

	intVal, err := strconv.Atoi(valueStr)
	if err != nil {
		return
	}

	fieldVal.SetInt(int64(intVal))
}

func setBoolValue(fieldVal reflect.Value, valueStr string) {
	if valueStr == emptyStr {
		return
	}

	boolVal, err := strconv.ParseBool(valueStr)
	if err != nil {
		return
	}

	fieldVal.SetBool(boolVal)
}

func setPointerValue(fieldVal reflect.Value, fieldType reflect.Type,
	valueStr string) {
	if valueStr == emptyStr {
		return
	}

	elemType := fieldType.Elem()
	ptr := reflect.New(elemType)

	switch elemType.Kind() {
	case reflect.Int:
		setPointerInt(ptr, valueStr)

	case reflect.String:
		ptr.Elem().SetString(valueStr)

	case reflect.Bool:
		setPointerBool(ptr, valueStr)
	}

	fieldVal.Set(ptr)
}

func setPointerInt(ptr reflect.Value, valueStr string) {
	if intVal, err := strconv.Atoi(valueStr); err == nil {
		ptr.Elem().SetInt(int64(intVal))
	}
}

func setPointerBool(ptr reflect.Value, valueStr string) {
	if boolVal, err := strconv.ParseBool(valueStr); err == nil {
		ptr.Elem().SetBool(boolVal)
	}
}
