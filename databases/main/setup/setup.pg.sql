\echo
\echo '\033[1;32m[ setup shared extensions ]\033[0m'
\echo
\ir ../scripts/shared/extensions/pgtap.pg.sql
\ir ../scripts/shared/extensions/uuid.pg.sql
\echo
\echo '\033[1;32m[ setup schemas ]\033[0m'
\echo
\ir ../scripts/analytics/schema.pg.sql
\ir ../scripts/item/schema.pg.sql
\ir ../scripts/main/schema.pg.sql
\ir ../scripts/temporary/schema.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the main schema ]\033[0m'
\echo
\ir ../scripts/main/tables/tb_ai_style.pg.sql
\ir ../scripts/main/tables/tb_subscription.pg.sql
\ir ../scripts/main/tables/tb_user.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the item schema ]\033[0m'
\echo
\ir ../scripts/item/tables/tb_document.pg.sql
\ir ../scripts/item/tables/tb_image.pg.sql
\ir ../scripts/item/tables/tb_version.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the temporary schema ]\033[0m'
\echo
\ir ../scripts/temporary/tables/tb_document_sharing.pg.sql
\ir ../scripts/temporary/tables/tb_temporary_token.pg.sql
\echo
\echo '\033[1;32m[ setup tables in the analytics schema ]\033[0m'
\echo
\ir ../scripts/analytics/tables/tb_sharing_views.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the main schema ]\033[0m'
\echo
\ir ../scripts/main/functions/v1_ai_style_create.pg.sql
\ir ../scripts/main/functions/v1_ai_style_retrieve.pg.sql
\ir ../scripts/main/functions/v1_ai_style_retrieve_list.pg.sql
\ir ../scripts/main/functions/v1_ai_style_update.pg.sql
\ir ../scripts/main/functions/v1_overview_account.pg.sql
\ir ../scripts/main/functions/v1_subscription_create.pg.sql
\ir ../scripts/main/functions/v1_subscription_retrieve.pg.sql
\ir ../scripts/main/functions/v1_subscription_update.pg.sql
\ir ../scripts/main/functions/v1_subscription_update_via_customer_id.pg.sql
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
\ir ../scripts/item/functions/v1_document_retrieve_etag.pg.sql
\ir ../scripts/item/functions/v1_document_retrieve_list.pg.sql
\ir ../scripts/item/functions/v1_document_update.pg.sql
\ir ../scripts/item/functions/v1_image_check.pg.sql
\ir ../scripts/item/functions/v1_image_create.pg.sql
\ir ../scripts/item/functions/v1_image_retrieve.pg.sql
\ir ../scripts/item/functions/v1_image_update.pg.sql
\ir ../scripts/item/functions/v1_version_create.pg.sql
\ir ../scripts/item/functions/v1_version_retrieve_list.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the temporary schema ]\033[0m'
\echo
\ir ../scripts/temporary/functions/v1_document_sharing_check.pg.sql
\ir ../scripts/temporary/functions/v1_document_sharing_create.pg.sql
\ir ../scripts/temporary/functions/v1_document_sharing_delete.pg.sql
\ir ../scripts/temporary/functions/v1_document_sharing_retrieve_list.pg.sql
\ir ../scripts/temporary/functions/v1_temporary_token_create.pg.sql
\ir ../scripts/temporary/functions/v1_temporary_token_update.pg.sql
\echo
\echo '\033[1;32m[ setup functions in the analytics schema ]\033[0m'
\echo
\ir ../scripts/analytics/functions/v1_sharing_views_create.pg.sql
\ir ../scripts/analytics/functions/v1_sharing_views_retrieve_list.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the main schema ]\033[0m'
\echo
\ir ../scripts/main/indexes/idx_tb_ai_style.pg.sql
\ir ../scripts/main/indexes/idx_tb_subscription.pg.sql
\ir ../scripts/main/indexes/idx_tb_user.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the item schema ]\033[0m'
\echo
\ir ../scripts/item/indexes/idx_tb_document.pg.sql
\ir ../scripts/item/indexes/idx_tb_image.pg.sql
\ir ../scripts/item/indexes/idx_tb_version.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the temporary schema ]\033[0m'
\echo
\ir ../scripts/temporary/indexes/idx_tb_document_sharing.pg.sql
\ir ../scripts/temporary/indexes/idx_tb_temporary_token.pg.sql
\echo
\echo '\033[1;32m[ setup indexes in the the analytics schema ]\033[0m'
\echo
\ir ../scripts/analytics/indexes/idx_tb_sharing_views.pg.sql
\echo
\echo '\033[1;32m[ foreign keys in the the main schema ]\033[0m'
\echo
\ir ../scripts/main/fkeys/fk_tb_ai_style.pg.sql
\ir ../scripts/main/fkeys/fk_tb_subscription.pg.sql
\echo
