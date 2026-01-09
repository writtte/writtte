\echo create index for (account_code)
CREATE INDEX idx_folder_account ON schema_item.tb_folder (account_code);

\echo create index for (folder_code)
CREATE INDEX idx_folder_code ON schema_item.tb_folder (folder_code);
