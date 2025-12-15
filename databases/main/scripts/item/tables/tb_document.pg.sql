\echo create table schema_item.tb_document
CREATE TABLE IF NOT EXISTS schema_item.tb_document (
  id_main BIGSERIAL NOT NULL,
  account_code UUID NOT NULL,
  document_code UUID NOT NULL DEFAULT uuid_generate_v4 (),
  title VARCHAR(256) NOT NULL,
  lifecycle_state VARCHAR(16) NOT NULL,
  workflow_state VARCHAR(16) NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  deleted_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CHECK (lifecycle_state IN ('ACTIVE', 'DELETED')),
  CHECK (workflow_state IN ('PUBLISHED')),
  PRIMARY KEY (id_main)
);
