\echo create table schema_temporary.tb_document_sharing
CREATE TABLE IF NOT EXISTS schema_temporary.tb_document_sharing (
  id_main BIGSERIAL NOT NULL,
  account_code UUID NOT NULL,
  document_code UUID NOT NULL,
  sharing_code VARCHAR(7) NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  PRIMARY KEY (id_main),
  UNIQUE (sharing_code)
);
