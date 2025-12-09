\echo create table schema_main.tb_user
CREATE TABLE IF NOT EXISTS schema_main.tb_user (
  id_main BIGSERIAL NOT NULL,
  account_code UUID NOT NULL DEFAULT uuid_generate_v4 (),
  email_address VARCHAR(1024) NOT NULL,
  name VARCHAR(512) NOT NULL,
  hashed_password TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
  is_email_verified BOOLEAN NOT NULL DEFAULT TRUE,
  pending_deletion_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  deleted_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING_DELETION', 'DELETED')),
  PRIMARY KEY (id_main),
  UNIQUE (account_code),
  UNIQUE (email_address)
);
