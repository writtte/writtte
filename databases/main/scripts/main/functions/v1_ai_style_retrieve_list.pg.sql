\echo create function schema_main.v1_ai_style_retrieve_list()
CREATE OR REPLACE FUNCTION schema_main.v1_ai_style_retrieve_list (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_limit INTEGER;
  v_p_offset INTEGER;
  v_ai_styles_data JSONB;
  v_total_count INTEGER;
  v_check_user JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_limit := coalesce((p_data ->> 'limit')::INTEGER, 20);
  v_p_offset := coalesce((p_data ->> 'offset')::INTEGER, 0);
  v_check_user := schema_main.v1_user_check (json_build_object('account_code', v_p_account_code)::JSONB, TRUE)::JSONB;
  IF v_check_user ->> k_code != 'USER_EXISTS' THEN
    RETURN v_check_user;
  END IF;
  SELECT
    count(*) INTO v_total_count
  FROM
    schema_main.tb_ai_styles
  WHERE
    account_code = v_p_account_code
    AND deleted_time IS NULL;
  SELECT
    jsonb_agg(jsonb_build_object('style_code', tas.style_code, 'account_code', tas.account_code, 'name', tas.name, 'style', tas.style, 'created_time', tas.created_time, 'updated_time', tas.updated_time)) INTO v_ai_styles_data
  FROM (
    SELECT
      style_code,
      account_code,
      name,
      style,
      created_time,
      updated_time
    FROM
      schema_main.tb_ai_styles
    WHERE
      account_code = v_p_account_code
      AND deleted_time IS NULL
    ORDER BY
      created_time DESC
    LIMIT v_p_limit OFFSET v_p_offset) tas;
  IF v_ai_styles_data IS NULL THEN
    v_ai_styles_data := '[]'::JSONB;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'AI_STYLES_RETRIEVED_LIST', k_message, NULL, k_additional, NULL, k_data, json_build_object('total', v_total_count, 'limit', v_p_limit, 'offset', v_p_offset, 'items', v_ai_styles_data)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
