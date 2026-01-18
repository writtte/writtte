\echo create table schema_main.tb_ai_styles
CREATE TABLE IF NOT EXISTS schema_main.tb_ai_styles (
  id_main BIGSERIAL NOT NULL,
  style_code UUID NOT NULL,
  account_code UUID NOT NULL,
  name VARCHAR(256) NOT NULL,
  style VARCHAR NOT NULL DEFAULT '',
  deleted_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  PRIMARY KEY (id_main),
  UNIQUE (style_code)
);
