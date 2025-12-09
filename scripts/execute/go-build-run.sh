#!/bin/bash

if [ "$#" -ne 3 ]; then
  echo "usage: $0 <exe> <src> <parameter>"
  exit 1
fi

go build -x -v -o "$1" "$2"
./"$1" "$3"
