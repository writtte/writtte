#!/bin/bash

# Please run this script from the root of the project

arg_type="${1}"

if [ -z "$arg_type" ]; then
  echo "usage go.sh <argument>"
  echo "  --coverage: run coverage test"
  echo "  --unit-test: run unit test"
  echo "  --benchmark-test: run benchmark test"
  exit 1
fi

updated_files=$(git diff --name-only origin/main...HEAD | grep -E '\.go$')
if [ -z "$updated_files" ]; then
  echo "no Go files updated, skipping testing.."
  exit 0
fi

run_coverage() {
  echo "running coverage test.."
  go test ./... -cover -coverprofile=temp/coverage.out
  go tool cover -html=temp/coverage.out -o temp/coverage.html
}

run_unit() {
  echo "running unit test.."
  go test ./...
}

run_benchmark() {
  echo "running benchmark test.."
  go test -v ./... -bench=. -run=xxx -benchmem
}

case $arg_type in
"--coverage")
  run_coverage
  ;;
"--unit-test")
  run_unit
  ;;
"--benchmark-test")
  run_benchmark
  ;;
*)
  echo "invalid argument"
  exit 1
  ;;
esac
