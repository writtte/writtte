\echo create table schema_temporary.tb_temporary_token
CREATE TABLE IF NOT EXISTS schema_temporary.tb_temporary_token (
  id_main BIGSERIAL NOT NULL,
  type varchar(16) NOT NULL,
  key text NOT NULL,
  value TEXT NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  expiration_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CHECK (type IN ('SIGN_UP_VERIFY', 'EMAIL_UPDATE')),
  CHECK (status IN ('ACTIVE', 'USED')),
  PRIMARY KEY (id_main),
  UNIQUE (key, value)
);
