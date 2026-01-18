\echo create index on schema_main.tb_ai_styles for (style_code)
CREATE INDEX idx_ai_styles_style_code ON schema_main.tb_ai_styles (style_code);

\echo create index on schema_main.tb_ai_styles for (account_code)
CREATE INDEX idx_ai_styles_account_code ON schema_main.tb_ai_styles (account_code);
