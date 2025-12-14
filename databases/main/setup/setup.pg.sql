\echo
\echo '\033[1;32m[ setup shared extensions ]\033[0m'
\echo
\ir ../scripts/shared/extensions/pgtap.pg.sql
\ir ../scripts/shared/extensions/uuid.pg.sql
\echo
\echo '\033[1;32m[ setup schemas ]\033[0m'
\echo
\ir ../scripts/main/schema.pg.sql
\ir ../scripts/item/schema.pg.sql
\ir ../scripts/temporary/schema.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the main schema ]\033[0m'
\echo
\ir ../scripts/main/tables/tb_user.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the item schema ]\033[0m'
\echo
\ir ../scripts/item/tables/tb_document.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the temporary schema ]\033[0m'
\echo
\ir ../scripts/temporary/tables/tb_temporary_token.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the main schema ]\033[0m'
\echo
\ir ../scripts/main/functions/v1_overview_account.pg.sql
\ir ../scripts/main/functions/v1_user_check.pg.sql
\ir ../scripts/main/functions/v1_user_create.pg.sql
\ir ../scripts/main/functions/v1_user_retrieve.pg.sql
\ir ../scripts/main/functions/v1_user_update.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the item schema ]\033[0m'
\echo
\ir ../scripts/item/functions/v1_document_check.pg.sql
\ir ../scripts/item/functions/v1_document_create.pg.sql
\ir ../scripts/item/functions/v1_document_retrieve.pg.sql
\ir ../scripts/item/functions/v1_document_retrieve_list.pg.sql
\ir ../scripts/item/functions/v1_document_update.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the temporary schema ]\033[0m'
\echo
\ir ../scripts/temporary/functions/v1_temporary_token_create.pg.sql
\ir ../scripts/temporary/functions/v1_temporary_token_update.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the main schema ]\033[0m'
\echo
\ir ../scripts/main/indexes/idx_tb_user.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the item schema ]\033[0m'
\echo
\ir ../scripts/item/indexes/idx_tb_document.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the temporary schema ]\033[0m'
\echo
\ir ../scripts/temporary/indexes/idx_tb_temporary_token.pg.sql
