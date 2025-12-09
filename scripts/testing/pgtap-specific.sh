#!/bin/bash

# The below variables should be set in the environment:
#   - DB_HOST
#   - DB_PORT
#   - DB_NAME
#   - DB_USER
#   - DB_PASSWORD
#   - DB_SCRIPTS (array of script files)
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

required_vars=("DB_HOST" "DB_PORT" "DB_NAME" "DB_USER" "DB_PASSWORD" "DB_SCRIPTS")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "$var is not set in the environment variables before running the script"
    exit 1
  fi
done

export PGUSER="$DB_USER"
export PGPASSWORD="$DB_PASSWORD"

run_pgtap() {
  local script=$1
  is_passed=false

  echo -e "\n${CYAN}${BOLD}┌────────────────────────────────────────►${RESET}"
  echo -e "${CYAN}${BOLD}│${RESET} ${GREEN}running pg_prove on file ${YELLOW}$script${RESET}"
  echo -e "${CYAN}${BOLD}└────────────────────────────────────────►${RESET}\n"

  if ! pg_prove -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -f -o -c --normalize "$script"; then
    is_passed=true
  fi

  if [ $is_passed = true ]; then
    echo -e "test failed for $script"

    unset PGUSER
    unset PGPASSWORD
    exit 1
  fi
}

readarray -t SCRIPT_ARRAY <<<"$DB_SCRIPTS"
for script in "${SCRIPT_ARRAY[@]}"; do
  script=$(echo "$script" | tr -d '[:space:]')
  if [ ! -z "$script" ]; then
    run_pgtap "$script"
  fi
done

unset PGUSER
unset PGPASSWORD
