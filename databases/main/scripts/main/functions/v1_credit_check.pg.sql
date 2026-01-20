\echo create function schema_main.v1_credit_check()
CREATE OR REPLACE FUNCTION schema_main.v1_credit_check (p_account_code UUID, p_credit_type VARCHAR DEFAULT NULL)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status TEXT := 'status';
  k_code TEXT := 'code';
  k_message TEXT := 'message';
  k_additional TEXT := 'additional';
  k_data TEXT := 'data';
  v_subscription_exists BOOLEAN := FALSE;
  v_manual_exists BOOLEAN := FALSE;
  v_exception TEXT;
BEGIN
  IF p_credit_type IS NOT NULL THEN
    IF EXISTS (
      SELECT
        1
      FROM
        schema_main.tb_credit
      WHERE
        account_code = p_account_code
        AND credit_type = p_credit_type) THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_ALREADY_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  ELSE
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
END IF;
  SELECT
    EXISTS (
      SELECT
        1
      FROM
        schema_main.tb_credit
      WHERE
        account_code = p_account_code
        AND credit_type = 'subscription'),
    EXISTS (
      SELECT
        1
      FROM
        schema_main.tb_credit
      WHERE
        account_code = p_account_code
        AND credit_type = 'manual') INTO v_subscription_exists,
    v_manual_exists;
  IF v_subscription_exists OR v_manual_exists THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_ALREADY_EXISTS', k_message, NULL, k_additional, NULL, k_data, json_build_object('subscription_exists', v_subscription_exists, 'manual_exists', v_manual_exists))::JSONB;
  ELSE
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
