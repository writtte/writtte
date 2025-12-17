\echo create foreign key on schema_main.tb_subscription for (account_code) references schema_main.tb_user
ALTER TABLE schema_main.tb_subscription
  ADD CONSTRAINT fk_subscription_account_code FOREIGN KEY (account_code) REFERENCES schema_main.tb_user (account_code);
