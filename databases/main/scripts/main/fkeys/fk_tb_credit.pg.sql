\echo create foreign key on schema_main.tb_credit for (account_code) references schema_main.tb_user
ALTER TABLE schema_main.tb_credit
  ADD CONSTRAINT fk_tb_credit_account_code FOREIGN KEY (account_code) REFERENCES schema_main.tb_user (account_code);
