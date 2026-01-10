\echo create table schema_item.tb_folder
CREATE TABLE IF NOT EXISTS schema_item.tb_folder (
  id_main BIGSERIAL NOT NULL,
  account_code UUID NOT NULL,
  folder_code UUID NOT NULL DEFAULT uuid_generate_v4 (),
  title VARCHAR(256) NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  PRIMARY KEY (id_main),
  UNIQUE (folder_code)
);
