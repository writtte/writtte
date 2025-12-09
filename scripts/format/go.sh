#!/bin/bash

# Please run this script from the root of the project

echo "formatting all go files.."

updated_files=$(
  git diff --name-only
  git ls-files -o --exclude-standard
)

go_files=$(echo "$updated_files" | grep -E '\.go$')

if [ -n "$go_files" ]; then
  echo "running go fmt..."
  echo "$go_files" | xargs -n1 dirname | sort -u | xargs -I{} go fmt {}/...

  echo "running goimports-reviser..."
  echo "$go_files" | xargs -I{} goimports-reviser -rm-unused {}
fi

exit 0
