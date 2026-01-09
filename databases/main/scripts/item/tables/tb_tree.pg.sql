\echo create table schema_item.tb_tree
CREATE TABLE IF NOT EXISTS schema_item.tb_tree (
  id_main BIGSERIAL NOT NULL,
  folder_code UUID NOT NULL,
  document_code UUID NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  PRIMARY KEY (id_main)
);
