\echo create function schema_main.v1_credit_reset()
CREATE OR REPLACE FUNCTION schema_main.v1_credit_reset (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status TEXT := 'status';
  k_code TEXT := 'code';
  k_message TEXT := 'message';
  k_additional TEXT := 'additional';
  k_data TEXT := 'data';
  v_p_account_code UUID;
  v_p_reset_subscription BOOLEAN;
  v_p_reset_manual BOOLEAN;
  v_check_credit JSONB;
  v_subscription_exists BOOLEAN := FALSE;
  v_manual_exists BOOLEAN := FALSE;
  v_reset_count INT := 0;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_reset_subscription := (p_data ->> 'reset_subscription')::BOOLEAN;
  v_p_reset_manual := (p_data ->> 'reset_manual')::BOOLEAN;
  v_check_credit := schema_main.v1_credit_check (v_p_account_code);
  IF v_check_credit ->> k_code = 'CREDIT_NOT_EXISTS' THEN
    RETURN v_check_credit;
  END IF;
  SELECT
    (v_check_credit -> 'data' ->> 'subscription_exists')::BOOLEAN,
    (v_check_credit -> 'data' ->> 'manual_exists')::BOOLEAN INTO v_subscription_exists,
    v_manual_exists;
  IF v_p_reset_subscription AND v_subscription_exists THEN
    UPDATE
      schema_main.tb_credit
    SET
      credit_amount = 0.00,
      allocated_amount = 0.00,
      updated_time = now()
    WHERE
      account_code = v_p_account_code
      AND credit_type = 'subscription';
    v_reset_count := v_reset_count + 1;
  END IF;
  IF v_p_reset_manual AND v_manual_exists THEN
    UPDATE
      schema_main.tb_credit
    SET
      credit_amount = 0.00,
      allocated_amount = 0.00,
      updated_time = now()
    WHERE
      account_code = v_p_account_code
      AND credit_type = 'manual';
    v_reset_count := v_reset_count + 1;
  END IF;
  IF v_reset_count > 0 THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_RESET', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  ELSE
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_NOTHING_TO_RESET', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
