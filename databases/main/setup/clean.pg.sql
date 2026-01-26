SET client_min_messages TO warning;

\echo drop main schema
DROP SCHEMA IF EXISTS schema_main CASCADE;

\echo drop analytics schema
DROP SCHEMA IF EXISTS schema_analytics CASCADE;

\echo drop item schema
DROP SCHEMA IF EXISTS schema_item CASCADE;

\echo drop temporary schema
DROP SCHEMA IF EXISTS schema_temporary CASCADE;

RESET client_min_messages;
