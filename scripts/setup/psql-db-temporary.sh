#!/bin/bash

# This script is used to create and delete temporary databases in PostgreSQL
#
# The below variables should be set in the environment:
#   - DB_HOST
#   - DB_PORT
#   - DB_NAME
#   - DB_USER
#   - DB_PASSWORD
#
# The below environment variable only needs to be set when running
# the script with the '--delete' argument:
#   - DB_TEMP

ARG_FLOW="$1"

required_vars=("DB_HOST" "DB_PORT" "DB_NAME" "DB_USER" "DB_PASSWORD")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "$var is not set in the environment variables before running the script"
    exit 1
  fi
done

export PGUSER="$DB_USER"
export PGPASSWORD="$DB_PASSWORD"

gen_unique_name() {
  unique_id=$(date +%Y%m%d%H%M%S)_$$_$(od -vAn -N4 -tu4 </dev/urandom | tr -d ' ')
  echo "temp_db_${DB_NAME}_${unique_id}"
}

setup_temp_db() {
  local temp_name
  temp_name=$(gen_unique_name)

  if ! psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -c "CREATE DATABASE ${temp_name};"; then
    echo "psql failed while trying to create temporary database ${temp_name}"

    unset PGUSER
    unset PGPASSWORD
    exit 1
  fi

  export TEMPORARY_CREATED_PSQL_DATABASE="$temp_name"
  echo "temporary database ${temp_name} was created and exported as TEMPORARY_CREATED_PSQL_DATABASE"
}

delete_temp_dbs() {
  DB_TEMP_LIST=$(psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -t -c "
                SELECT datname
                FROM pg_database
                WHERE datname LIKE 'temp_db_%';")

  if [[ -z "$DB_TEMP_LIST" ]]; then
    echo "no temporary databases found with prefix 'temp_db_'."
    return
  fi

  for DB_TEMP in $DB_TEMP_LIST; do
    echo "Attempting to delete temporary database: $DB_TEMP"
    psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -c "
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = '${DB_TEMP}'
                  AND pid <> pg_backend_pid();"

    if ! psql -h "$DB_HOST" -p "$DB_PORT" -d "postgres" -c "DROP DATABASE ${DB_TEMP};"; then
      echo "psql failed while trying to delete temporary database ${DB_TEMP}"
    else
      echo "temporary database ${DB_TEMP} successfully deleted."
    fi
  done
}

case "$ARG_FLOW" in
"--setup")
  setup_temp_db
  ;;
"--delete")
  delete_temp_dbs
  ;;
*)
  echo "invalid argument: please use either '--setup' or '--delete'"
  exit 1
  ;;
esac

unset PGUSER
unset PGPASSWORD
