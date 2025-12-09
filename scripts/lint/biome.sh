#!/bin/bash

set -e

# Please run this script from the root of the project
#
# https://biomejs.dev

bun run fe:types
bun run pkg:types

bun run fe:check
bun run pkg:check
