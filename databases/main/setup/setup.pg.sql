\echo
\echo '\033[1;32m[ setup shared extensions ]\033[0m'
\echo
\ir ../scripts/shared/extensions/pgtap.pg.sql
\ir ../scripts/shared/extensions/uuid.pg.sql
\echo
\echo '\033[1;32m[ setup schemas ]\033[0m'
\echo
\ir ../scripts/main/schema.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the main schema ]\033[0m'
\echo
\ir ../scripts/main/tables/tb_user.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the main schema ]\033[0m'
\echo
\ir ../scripts/main/functions/v1_user_check.pg.sql
\ir ../scripts/main/functions/v1_user_create.pg.sql
\ir ../scripts/main/functions/v1_user_retrieve.pg.sql
\ir ../scripts/main/functions/v1_user_update.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the main schema ]\033[0m'
\echo
\ir ../scripts/main/indexes/idx_tb_user.pg.sql
