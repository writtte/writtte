\echo create index for (folder_code)
CREATE INDEX idx_tree_folder ON schema_item.tb_tree (folder_code);

\echo create index for (document_code)
CREATE INDEX idx_tree_document ON schema_item.tb_tree (document_code);
