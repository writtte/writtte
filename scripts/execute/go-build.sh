#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <exe> [source...]"
  exit 1
fi

output="$1"
shift

if go build -x -v -o "$output" "$@"; then
  echo "build successful: $output"
else
  echo "build failed!"
  exit 1
fi
