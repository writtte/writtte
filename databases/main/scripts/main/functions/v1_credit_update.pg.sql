\echo create function schema_main.v1_credit_update()
CREATE OR REPLACE FUNCTION schema_main.v1_credit_update (p_account_code UUID, p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status TEXT := 'status';
  k_code TEXT := 'code';
  k_message TEXT := 'message';
  k_additional TEXT := 'additional';
  k_data TEXT := 'data';
  v_used_credit_amount NUMERIC(18, 6);
  v_check_credit JSONB;
  v_credit_retrieve JSONB;
  v_total_available NUMERIC(18, 6) := 0;
  v_subscription_amount NUMERIC(18, 6) := 0;
  v_manual_amount NUMERIC(18, 6) := 0;
  v_subscription_used NUMERIC(18, 6) := 0;
  v_manual_used NUMERIC(18, 6) := 0;
  v_subscription_exists BOOLEAN := FALSE;
  v_manual_exists BOOLEAN := FALSE;
  v_exception TEXT;
BEGIN
  v_used_credit_amount := (p_data ->> 'used_credit_amount')::NUMERIC(18, 6);
  v_check_credit := schema_main.v1_credit_check (p_account_code);
  IF v_check_credit ->> k_code != 'CREDIT_ALREADY_EXISTS' THEN
    RETURN v_check_credit;
  END IF;
  SELECT
    (v_check_credit -> 'data' ->> 'subscription_exists')::BOOLEAN,
    (v_check_credit -> 'data' ->> 'manual_exists')::BOOLEAN INTO v_subscription_exists,
    v_manual_exists;
  v_credit_retrieve := schema_main.v1_credit_retrieve (p_account_code);
  v_total_available := (v_credit_retrieve -> 'data' ->> 'total_credit_amount')::NUMERIC(18, 6);
  IF v_total_available < v_used_credit_amount THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_INSUFFICIENT', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  IF v_subscription_exists THEN
    v_subscription_amount := (v_credit_retrieve -> 'data' -> 'subscription' ->> 'credit_amount')::NUMERIC(18, 6);
  END IF;
  IF v_manual_exists THEN
    v_manual_amount := (v_credit_retrieve -> 'data' -> 'manual' ->> 'credit_amount')::NUMERIC(18, 6);
  END IF;
  v_subscription_used := LEAST (v_subscription_amount, v_used_credit_amount);
  IF v_subscription_used < v_used_credit_amount THEN
    v_manual_used := v_used_credit_amount - v_subscription_used;
  END IF;
  IF v_subscription_exists AND v_subscription_used > 0 THEN
    UPDATE
      schema_main.tb_credit
    SET
      credit_amount = credit_amount - v_subscription_used,
      updated_time = now()
    WHERE
      account_code = p_account_code
      AND credit_type = 'subscription';
  END IF;
  IF v_manual_exists AND v_manual_used > 0 THEN
    UPDATE
      schema_main.tb_credit
    SET
      credit_amount = credit_amount - v_manual_used,
      updated_time = now()
    WHERE
      account_code = p_account_code
      AND credit_type = 'manual';
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_UPDATED', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
