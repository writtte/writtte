\echo create foreign key on schema_main.tb_ai_styles for (account_code) references schema_main.tb_user
ALTER TABLE schema_main.tb_ai_styles
  ADD CONSTRAINT fk_ai_styles_account_code FOREIGN KEY (account_code) REFERENCES schema_main.tb_user (account_code);
