\echo create table schema_item.tb_version
CREATE TABLE IF NOT EXISTS schema_item.tb_version (
  id_main BIGSERIAL NOT NULL,
  version_code UUID NOT NULL DEFAULT uuid_generate_v4 (),
  document_code UUID NOT NULL,
  stored_type VARCHAR(16) NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (stored_type IN ('AUTOMATIC', 'MANUAL')),
  PRIMARY KEY (id_main)
);
