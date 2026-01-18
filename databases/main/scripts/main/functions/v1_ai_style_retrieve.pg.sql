\echo create function schema_main.v1_ai_style_retrieve()
CREATE OR REPLACE FUNCTION schema_main.v1_ai_style_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_style_code UUID;
  v_p_account_code UUID;
  v_ai_style_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_style_code := (p_data ->> 'style_code')::UUID;
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  IF NOT EXISTS (
    SELECT
      1
    FROM
      schema_main.tb_ai_styles
    WHERE
      style_code = v_p_style_code
      AND (v_p_account_code IS NULL
        OR account_code = v_p_account_code)
      AND deleted_time IS NULL) THEN
  RETURN json_build_object(k_status, TRUE, k_code, 'AI_STYLE_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
END IF;
  v_ai_style_data := (
    SELECT
      json_build_object('style_code', tas.style_code, 'account_code', tas.account_code, 'name', tas.name, 'style', tas.style, 'created_time', tas.created_time, 'updated_time', tas.updated_time)
    FROM
      schema_main.tb_ai_styles tas
    WHERE
      tas.style_code = v_p_style_code
      AND deleted_time IS NULL);
  RETURN json_build_object(k_status, TRUE, k_code, 'AI_STYLE_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_ai_style_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
