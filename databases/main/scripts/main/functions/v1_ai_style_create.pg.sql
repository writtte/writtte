\echo create function schema_main.v1_ai_style_create()
CREATE OR REPLACE FUNCTION schema_main.v1_ai_style_create (p_data JSONB)
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
  v_style_code UUID;
  v_check_user JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_name := (p_data ->> 'name');
  v_p_style := coalesce(p_data ->> 'style', '');
  v_check_user := schema_main.v1_user_check (json_build_object('account_code', v_p_account_code)::JSONB, TRUE)::JSONB;
  IF v_check_user ->> k_code != 'USER_EXISTS' THEN
    RETURN v_check_user;
  END IF;
  INSERT INTO schema_main.tb_ai_styles (style_code, account_code, name, style)
    VALUES (uuid_generate_v4 (), v_p_account_code, v_p_name, v_p_style)
  RETURNING
    style_code INTO v_style_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'AI_STYLE_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('style_code', v_style_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
