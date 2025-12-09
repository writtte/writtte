#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <src> [parameters...]"
  exit 1
fi

src="$1"
shift

go run -v "$src" "$@"
