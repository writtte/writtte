\echo create function schema_main.v1_ai_style_update()
CREATE OR REPLACE FUNCTION schema_main.v1_ai_style_update (p_style_code UUID, p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_name VARCHAR(256);
  v_p_style VARCHAR;
  v_p_is_deleted BOOLEAN;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_name := (p_data ->> 'name');
  v_p_style := (p_data ->> 'style');
  v_p_is_deleted := (p_data ->> 'is_deleted')::BOOLEAN;
  IF NOT EXISTS (
    SELECT
      1
    FROM
      schema_main.tb_ai_styles
    WHERE
      style_code = p_style_code
      AND account_code = v_p_account_code
      AND deleted_time IS NULL) THEN
  RETURN json_build_object(k_status, TRUE, k_code, 'AI_STYLE_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
END IF;
  UPDATE
    schema_main.tb_ai_styles
  SET
    name = coalesce(v_p_name, name),
    style = coalesce(v_p_style, style),
    deleted_time = CASE WHEN v_p_is_deleted = TRUE THEN
      now()
    ELSE
      deleted_time
    END,
    updated_time = now()
  WHERE
    style_code = p_style_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'AI_STYLE_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('style_code', p_style_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
