#!/bin/bash

generate_js_id() {
  local length=10
  local id

  if ! id=$(LC_ALL=C tr -dc '[:lower:]' </dev/urandom | head -c "$length"); then
    echo "error: failed to generate ID" >&2
    return 1
  fi

  echo "$id"
}

if ! js_id=$(generate_js_id); then
  exit 1
fi

echo "generated js-style id: $js_id"
