\echo create index on document_code
CREATE INDEX idx_image_document_code ON schema_item.tb_image (document_code);

\echo create composite index for (document_code, lifecycle_state)
CREATE INDEX idx_image_document_lifecycle ON schema_item.tb_image (document_code, lifecycle_state);
