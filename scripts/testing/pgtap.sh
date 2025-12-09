#!/bin/bash

# The below variables should be set in the environment:
#   - DB_HOST
#   - DB_PORT
#   - DB_NAME
#   - DB_USER
#   - DB_PASSWORD
#   - DB_DIRECTORY
#
# https://pgtap.org/pg_prove.html

export RED="\033[31m"
export GREEN="\033[32m"
export YELLOW="\033[33m"
export BLUE="\033[34m"
export CYAN="\033[36m"
export WHITE="\033[37m"
export BOLD="\033[1m"
export RESET="\033[0m"

required_vars=("DB_HOST" "DB_PORT" "DB_NAME" "DB_USER" "DB_PASSWORD" "DB_DIRECTORY")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "$var is not set in the environment variables before running the script"
    exit 1
  fi
done

export PGUSER="$DB_USER"
export PGPASSWORD="$DB_PASSWORD"

run_pgtap() {
  is_passed=false
  sql_files=$(find "$DB_DIRECTORY" -type f \( -name '*_test.pg.sql' \))

  for sql_file in $sql_files; do
    echo -e "\n${CYAN}${BOLD}┌────────────────────────────────────────►${RESET}"
    echo -e "${CYAN}${BOLD}│${RESET} ${GREEN}running pg_prove on file ${YELLOW}$sql_file${RESET}"
    echo -e "${CYAN}${BOLD}└────────────────────────────────────────►${RESET}\n"

    if ! pg_prove -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -f -o -c --normalize "$sql_file"; then
      is_passed=true
    fi
  done

  if [ $is_passed = true ]; then
    echo -e "some tests failed"

    unset PGUSER
    unset PGPASSWORD
    exit 1
  fi
}

run_pgtap

unset PGUSER
unset PGPASSWORD
