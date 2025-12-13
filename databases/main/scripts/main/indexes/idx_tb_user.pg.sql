\echo create index on schema_main.tb_user for (account_code)
CREATE INDEX idx_user_account_code ON schema_main.tb_user (account_code);

\echo create index on schema_main.tb_user for (email_address)
CREATE INDEX idx_user_email_address ON schema_main.tb_user (email_address);
