#!/bin/bash

# Please run this script from the root of the project
#
# https://github.com/darold/pgFormatter

echo "formatting updated postgre sql scripts.."

updated_files=$(
  git diff --name-only
  git ls-files -o --exclude-standard
)

echo "$updated_files" | grep -E '\.pg\.sql$' | while read -r file; do
  echo "formatting $file.."
  pg_format -i -L -g -X -C -s 2 -f 1 -u 2 -U 2 "$file"
done
