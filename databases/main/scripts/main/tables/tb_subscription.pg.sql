\echo create table schema_main.tb_subscription
CREATE TABLE IF NOT EXISTS schema_main.tb_subscription (
  id_main BIGSERIAL NOT NULL,
  account_code UUID NOT NULL,
  customer_id UUID DEFAULT NULL,
  seat_count INT NOT NULL DEFAULT 1,
  service VARCHAR(32) DEFAULT NULL,
  service_data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(16) NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CHECK (status IN ('ACTIVE', 'CANCELED', 'PAST_DUE', 'PAUSED', 'TRIALING', 'EXPIRED', 'INCOMPLETE', 'PENDING', 'UNPAID')),
  PRIMARY KEY (id_main),
  UNIQUE (account_code)
);
