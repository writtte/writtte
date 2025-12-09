#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <exe> [source...]"
  exit 1
fi

output="$1"
shift

if GOOS=linux GOARCH=amd64 go build -x -v -o "$output" "$@"; then
  echo "linux build successful: $output"
else
  echo "linux build failed!"
  exit 1
fi
