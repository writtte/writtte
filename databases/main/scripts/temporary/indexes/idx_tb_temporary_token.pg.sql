\echo create index on schema_temporary.tb_temporary_token for (key, value)
CREATE INDEX idx_token_key_value ON schema_temporary.tb_temporary_token (key, value);
