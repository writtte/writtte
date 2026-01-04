\echo create table schema_item.tb_image
CREATE TABLE IF NOT EXISTS schema_item.tb_image (
  id_main BIGSERIAL NOT NULL,
  document_code UUID NOT NULL,
  image_code UUID NOT NULL DEFAULT uuid_generate_v4 (),
  lifecycle_state VARCHAR(16) NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  deleted_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CHECK (lifecycle_state IN ('AVAILABLE', 'DELETED')),
  PRIMARY KEY (id_main)
);
