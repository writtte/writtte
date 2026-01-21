\echo create table schema_main.tb_credit
CREATE TABLE IF NOT EXISTS schema_main.tb_credit (
  id_main BIGSERIAL NOT NULL,
  account_code UUID NOT NULL,
  allocated_amount NUMERIC(18, 6) NOT NULL DEFAULT 0.00,
  credit_type VARCHAR(16) NOT NULL,
  credit_amount NUMERIC(18, 6) NOT NULL DEFAULT 0.00,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CHECK (credit_type IN ('subscription', 'manual')),
  PRIMARY KEY (id_main),
  UNIQUE (account_code, credit_type)
);
