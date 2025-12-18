\echo create index on schema_main.tb_subscription for (account_code)
CREATE INDEX idx_subscription_account_code ON schema_main.tb_subscription (account_code);
