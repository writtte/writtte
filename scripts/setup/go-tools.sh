#!/bin/bash

# This script is used to setup go tools

echo "Installing errcheck..."
go install github.com/kisielk/errcheck@latest

echo "Installing gosec..."
go install github.com/securego/gosec/v2/cmd/gosec@latest

echo "Installing revive..."
go install github.com/mgechev/revive@latest

echo "Installing staticcheck..."
go install honnef.co/go/tools/cmd/staticcheck@latest

echo "Installing goimports-reviser..."
go install github.com/incu6us/goimports-reviser/v3@latest
