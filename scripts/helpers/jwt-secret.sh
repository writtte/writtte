#!/bin/bash

generate_jwt_secret_key() {
  local key_length=32 # 256 bits = 32 bytes
  local key

  if ! key=$(head -c "$key_length" /dev/urandom | base64); then
    echo "error: failed to generate random key" >&2
    return 1
  fi

  echo "$key"
}

if ! key=$(generate_jwt_secret_key); then
  exit 1
fi

echo "generated JWT secret key (base64): $key"
