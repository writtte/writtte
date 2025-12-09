#!/bin/bash

generate_xchacha20_poly1305_key() {
  local key_length=32 # 256 bits = 32 bytes
  local key

  if ! key=$(head -c "$key_length" /dev/urandom | xxd -p -c 32); then
    echo "error: failed to generate random key" >&2
    return 1
  fi

  echo "$key"
}

if ! key=$(generate_xchacha20_poly1305_key); then
  exit 1
fi

echo "generated XChaCha20-Poly1305 key (hex): $key"
