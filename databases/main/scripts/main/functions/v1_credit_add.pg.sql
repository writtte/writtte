\echo create function schema_main.v1_credit_add()
CREATE OR REPLACE FUNCTION schema_main.v1_credit_add (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status TEXT := 'status';
  k_code TEXT := 'code';
  k_message TEXT := 'message';
  k_additional TEXT := 'additional';
  k_data TEXT := 'data';
  v_p_account_code UUID;
  v_p_subscription_amount NUMERIC(18, 6);
  v_p_manual_amount NUMERIC(18, 6);
  v_p_reset_subscription BOOLEAN := FALSE;
  v_p_reset_manual BOOLEAN := FALSE;
  v_check_credit JSONB;
  v_subscription_exists BOOLEAN := FALSE;
  v_manual_exists BOOLEAN := FALSE;
  v_p_allocated_subscription_amount NUMERIC(18, 6);
  v_p_allocated_manual_amount NUMERIC(18, 6);
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_subscription_amount := (p_data ->> 'subscription_credit_amount')::NUMERIC(18, 6);
  v_p_manual_amount := (p_data ->> 'manual_credit_amount')::NUMERIC(18, 6);
  v_p_reset_subscription := coalesce((p_data ->> 'reset_subscription_credit_amount')::BOOLEAN, FALSE);
  v_p_reset_manual := coalesce((p_data ->> 'reset_manual_credit_amount')::BOOLEAN, FALSE);
  v_check_credit := schema_main.v1_credit_check (v_p_account_code);
  IF v_check_credit ->> k_code = 'CREDIT_ALREADY_EXISTS' THEN
    SELECT
      (v_check_credit -> 'data' ->> 'subscription_exists')::BOOLEAN,
      (v_check_credit -> 'data' ->> 'manual_exists')::BOOLEAN INTO v_subscription_exists,
      v_manual_exists;
  END IF;
  v_p_allocated_subscription_amount := (p_data ->> 'allocated_subscription_credit_amount_to_add')::NUMERIC(18, 6);
  v_p_allocated_manual_amount := (p_data ->> 'allocated_manual_credit_amount_to_add')::NUMERIC(18, 6);
  IF v_p_subscription_amount IS NOT NULL OR v_p_allocated_subscription_amount IS NOT NULL OR v_p_reset_subscription THEN
    IF v_subscription_exists THEN
      IF v_p_reset_subscription THEN
        UPDATE
          schema_main.tb_credit
        SET
          credit_amount = 0.00,
          allocated_amount = 0.00,
          updated_time = now()
        WHERE
          account_code = v_p_account_code
          AND credit_type = 'subscription';
      END IF;
      UPDATE
        schema_main.tb_credit
      SET
        credit_amount = credit_amount + coalesce(v_p_subscription_amount, 0),
        allocated_amount = allocated_amount + coalesce(v_p_allocated_subscription_amount, 0),
        updated_time = now()
      WHERE
        account_code = v_p_account_code
        AND credit_type = 'subscription';
    ELSE
      INSERT INTO schema_main.tb_credit (account_code, credit_type, credit_amount, allocated_amount)
        VALUES (v_p_account_code, 'subscription', coalesce(v_p_subscription_amount, 0), coalesce(v_p_allocated_subscription_amount, 0));
    END IF;
  END IF;
  IF v_p_manual_amount IS NOT NULL OR v_p_allocated_manual_amount IS NOT NULL OR v_p_reset_manual THEN
    IF v_manual_exists THEN
      IF v_p_reset_manual THEN
        UPDATE
          schema_main.tb_credit
        SET
          credit_amount = 0.00,
          allocated_amount = 0.00,
          updated_time = now()
        WHERE
          account_code = v_p_account_code
          AND credit_type = 'manual';
      END IF;
      UPDATE
        schema_main.tb_credit
      SET
        credit_amount = credit_amount + coalesce(v_p_manual_amount, 0),
        allocated_amount = allocated_amount + coalesce(v_p_allocated_manual_amount, 0),
        updated_time = now()
      WHERE
        account_code = v_p_account_code
        AND credit_type = 'manual';
    ELSE
      INSERT INTO schema_main.tb_credit (account_code, credit_type, credit_amount, allocated_amount)
        VALUES (v_p_account_code, 'manual', coalesce(v_p_manual_amount, 0), coalesce(v_p_allocated_manual_amount, 0));
    END IF;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'CREDIT_ADDED', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
