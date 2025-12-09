#!/bin/bash

set -e

# Please run this script from the root of the project
#
# https://biomejs.dev

bun run all:fmt
bun run fe:fmt
bun run pkg:fmt
