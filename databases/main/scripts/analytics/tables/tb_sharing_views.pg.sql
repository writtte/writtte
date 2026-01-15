\echo create table schema_analytics.tb_sharing_views
CREATE TABLE IF NOT EXISTS schema_analytics.tb_sharing_views (
  id_main BIGSERIAL NOT NULL,
  page_code VARCHAR(7) NOT NULL,
  visitor_id UUID NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  PRIMARY KEY (id_main)
);
