\echo create function schema_main.v1_user_create()
CREATE OR REPLACE FUNCTION schema_main.v1_user_create (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_email_address VARCHAR(1024);
  v_p_name VARCHAR(512);
  v_p_hashed_password TEXT;
  v_p_password_salt TEXT;
  v_p_limits JSONB;
  v_p_usage JSONB;
  v_check_user JSONB;
  v_account_code UUID;
  v_subscription_create_results JSONB;
  v_p_manual_credit_amount NUMERIC(18, 6);
  v_credit_add_results JSONB;
  v_exception TEXT;
BEGIN
  v_p_email_address := lower(p_data ->> 'email_address');
  v_p_name := (p_data ->> 'name');
  v_p_hashed_password := (p_data ->> 'hashed_password');
  v_p_password_salt := (p_data ->> 'password_salt');
  v_p_limits := coalesce((p_data -> 'limits')::JSONB, '{}'::JSONB);
  v_p_usage := coalesce((p_data -> 'usage')::JSONB, '{}'::JSONB);
  v_p_manual_credit_amount := (p_data ->> 'manual_credit_amount')::NUMERIC(18, 6);
  v_check_user := schema_main.v1_user_check (json_build_object('email_address', v_p_email_address)::JSONB, FALSE);
  IF v_check_user ->> k_code != 'USER_NOT_EXISTS' THEN
    RETURN v_check_user;
  END IF;
  INSERT INTO schema_main.tb_user (email_address, name, hashed_password, password_salt, is_email_verified)
    VALUES (v_p_email_address, v_p_name, v_p_hashed_password, v_p_password_salt, TRUE)
  RETURNING
    account_code INTO v_account_code;
  v_subscription_create_results := schema_main.v1_subscription_create (json_build_object('account_code', v_account_code, 'status', 'NO_SUBSCRIPTION')::JSONB)::JSONB;
  IF (v_subscription_create_results ->> k_status)::BOOLEAN = FALSE THEN
    RAISE EXCEPTION 'failed to create subscription: %', v_subscription_create_results ->> k_message;
  END IF;
  IF v_p_manual_credit_amount IS NOT NULL THEN
    v_credit_add_results := schema_main.v1_credit_add (json_build_object('account_code', v_account_code, 'manual_credit_amount', v_p_manual_credit_amount, 'allocated_manual_credit_amount_to_add', v_p_manual_credit_amount)::JSONB);
    IF (v_credit_add_results ->> k_status)::BOOLEAN = FALSE THEN
      RAISE EXCEPTION 'failed to add credits: %', v_credit_add_results ->> k_message;
    END IF;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'USER_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('account_code', v_account_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
