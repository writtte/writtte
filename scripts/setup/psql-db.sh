#!/bin/bash

# The below variables should be set in the environment:
#   - DB_HOST
#   - DB_PORT
#   - DB_NAME
#   - DB_USER
#   - DB_PASSWORD
#   - DB_SCRIPT

required_vars=("DB_HOST" "DB_PORT" "DB_NAME" "DB_USER" "DB_PASSWORD" "DB_SCRIPT")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "$var is not set in the environment variables before running the script"
    exit 1
  fi
done

export PGUSER="$DB_USER"
export PGPASSWORD="$DB_PASSWORD"

setup_db() {
  if ! psql -h "$DB_HOST" -p "$DB_PORT" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "database $DB_NAME does not exist. creating it..."
    if ! psql -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "CREATE DATABASE \"$DB_NAME\""; then
      echo "failed to create database $DB_NAME"

      unset PGUSER
      unset PGPASSWORD
      exit 1
    fi
  fi

  if ! psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -f "$DB_SCRIPT"; then
    echo "psql failed while trying to run script ${DB_SCRIPT}"

    unset PGUSER
    unset PGPASSWORD
    exit 1
  fi
}

setup_db

unset PGUSER
unset PGPASSWORD
