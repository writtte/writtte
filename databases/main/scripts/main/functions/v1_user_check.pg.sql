\echo create function schema_main.v1_user_check()
CREATE OR REPLACE FUNCTION schema_main.v1_user_check (p_data JSONB, p_only_active BOOLEAN DEFAULT FALSE)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_email_address VARCHAR(1024);
  v_status VARCHAR(24);
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_email_address := lower(p_data ->> 'email_address');
  SELECT
    status INTO v_status
  FROM
    schema_main.tb_user tbu
  WHERE ((v_p_account_code IS NOT NULL
      AND tbu.account_code = v_p_account_code)
    OR (v_p_email_address IS NOT NULL
      AND tbu.email_address = v_p_email_address))
    AND (NOT p_only_active
      OR tbu.status = 'ACTIVE')
  LIMIT 1;
  IF v_status IS NULL OR v_status = 'DELETED' THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'USER_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'USER_EXISTS', k_message, NULL, k_additional, NULL, k_data, json_build_object('status', v_status)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
