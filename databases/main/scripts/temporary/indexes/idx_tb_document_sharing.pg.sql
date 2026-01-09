\echo create composite index for (account_code, document_code)
CREATE INDEX idx_document_sharing_account_document ON schema_temporary.tb_document_sharing (account_code, document_code);

\echo create index for (sharing_code)
CREATE UNIQUE INDEX idx_document_sharing_code ON schema_temporary.tb_document_sharing (sharing_code);
