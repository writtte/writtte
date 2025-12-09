SET client_min_messages TO warning;

\echo drop main schema
DROP SCHEMA IF EXISTS schema_main CASCADE;

\echo drop temporary schema
drop schema if exists schema_temporary cascade;

RESET client_min_messages;
