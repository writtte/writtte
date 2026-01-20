\echo create function schema_main.v1_credit_retrieve()
CREATE OR REPLACE FUNCTION schema_main.v1_credit_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status TEXT := 'status';
  k_code TEXT := 'code';
  k_message TEXT := 'message';
  k_additional TEXT := 'additional';
  k_data TEXT := 'data';
  v_p_account_code UUID;
  v_check_credit JSONB;
  v_subscription_data JSONB := NULL;
  v_manual_data JSONB := NULL;
  v_total_credit_amount NUMERIC(18, 6) := 0.00;
  v_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_check_credit := schema_main.v1_credit_check (v_p_account_code);
  IF v_check_credit ->> k_code != 'CREDIT_ALREADY_EXISTS' THEN
    RETURN v_check_credit;
  END IF;
  IF (v_check_credit -> 'data' ->> 'subscription_exists')::BOOLEAN THEN
    SELECT
      json_build_object('credit_amount', credit_amount, 'allocated_amount', allocated_amount, 'created_time', created_time, 'updated_time', updated_time)::JSONB INTO v_subscription_data
    FROM
      schema_main.tb_credit
    WHERE
      account_code = v_p_account_code
      AND credit_type = 'subscription';
    v_total_credit_amount := v_total_credit_amount + (v_subscription_data ->> 'credit_amount')::NUMERIC(18, 6);
  END IF;
  IF (v_check_credit -> 'data' ->> 'manual_exists')::BOOLEAN THEN
    SELECT
      json_build_object('credit_amount', credit_amount, 'allocated_amount', allocated_amount, 'created_time', created_time, 'updated_time', updated_time)::JSONB INTO v_manual_data
    FROM
      schema_main.tb_credit
    WHERE
      account_code = v_p_account_code
      AND credit_type = 'manual';
    v_total_credit_amount := v_total_credit_amount + (v_manual_data ->> 'credit_amount')::NUMERIC(18, 6);
  END IF;
  v_data := json_build_object('subscription', v_subscription_data, 'manual', v_manual_data, 'total_credit_amount', v_total_credit_amount)::JSONB;
  RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
