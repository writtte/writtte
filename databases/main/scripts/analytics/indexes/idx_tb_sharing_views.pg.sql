\echo create index on page_code
CREATE INDEX idx_sharing_views_page_code ON schema_analytics.tb_sharing_views (page_code);

\echo create index on visitor_id
CREATE INDEX idx_sharing_views_visitor_id ON schema_analytics.tb_sharing_views (visitor_id);

\echo create index on created_time
CREATE INDEX idx_sharing_views_created_time ON schema_analytics.tb_sharing_views (created_time);

\echo create composite index for (page_code, created_time)
CREATE INDEX idx_sharing_views_page_created ON schema_analytics.tb_sharing_views (page_code, created_time);

\echo create composite index for (page_code, visitor_id, created_time)
CREATE INDEX idx_sharing_views_page_visitor_created ON schema_analytics.tb_sharing_views (page_code, visitor_id, created_time);
