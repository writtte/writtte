\echo create composite index for (account_code, lifecycle_state)
CREATE INDEX idx_document_account_lifecycle ON schema_item.tb_document (account_code, lifecycle_state);

\echo create composite index for (account_code, lifecycle_state, workflow_state)
CREATE INDEX idx_document_account_lifecycle_workflow ON schema_item.tb_document (account_code, lifecycle_state, workflow_state);

\echo create index for (document_code) to efficiently retrieve e_tag
CREATE INDEX idx_document_code_etag ON schema_item.tb_document (document_code) INCLUDE (e_tag);
