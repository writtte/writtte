\echo create function schema_main.v1_subscription_update()
CREATE OR REPLACE FUNCTION schema_main.v1_subscription_update (p_account_code UUID, p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_customer_id UUID;
  v_p_seat_count INT;
  v_p_service VARCHAR(32);
  v_p_service_data JSONB;
  v_p_status VARCHAR(16);
  v_p_subscription_credit_amount NUMERIC(18, 6);
  v_updated_id BIGINT;
  v_updated_time TIMESTAMP WITH TIME ZONE;
  v_credit_add_results JSONB;
  v_exception TEXT;
BEGIN
  v_p_customer_id := (p_data ->> 'customer_id')::UUID;
  v_p_seat_count := (p_data ->> 'seat_count')::INT;
  v_p_service := (p_data ->> 'service');
  v_p_service_data := (p_data -> 'service_data')::JSONB;
  v_p_status := upper(p_data ->> 'status');
  v_p_subscription_credit_amount := (p_data ->> 'subscription_credit_amount')::NUMERIC(18, 6);
  UPDATE
    schema_main.tb_subscription
  SET
    customer_id = coalesce(v_p_customer_id, customer_id),
    seat_count = coalesce(v_p_seat_count, seat_count),
    service = coalesce(v_p_service, service),
    service_data = coalesce(v_p_service_data, service_data),
    status = coalesce(v_p_status, status),
    updated_time = now()
  WHERE
    account_code = p_account_code
  RETURNING
    id_main,
    updated_time INTO v_updated_id,
    v_updated_time;
  IF v_updated_id IS NULL THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'SUBSCRIPTION_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  IF v_p_subscription_credit_amount IS NOT NULL OR (p_data ->> 'reset_subscription_credit_amount')::BOOLEAN = TRUE OR (p_data ->> 'reset_manual_credit_amount')::BOOLEAN = TRUE THEN
    v_credit_add_results := schema_main.v1_credit_add (json_build_object('account_code', p_account_code, 'subscription_credit_amount', v_p_subscription_credit_amount, 'reset_subscription_credit_amount', (p_data ->> 'reset_subscription_credit_amount')::BOOLEAN, 'reset_manual_credit_amount', (p_data ->> 'reset_manual_credit_amount')::BOOLEAN, 'allocated_subscription_credit_amount_to_add', v_p_subscription_credit_amount)::JSONB);
    IF (v_credit_add_results ->> k_status)::BOOLEAN = FALSE THEN
      RAISE EXCEPTION 'failed to add credits: %', v_credit_add_results ->> k_message;
    END IF;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'SUBSCRIPTION_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('id_main', v_updated_id, 'account_code', p_account_code, 'status', v_p_status, 'updated_time', v_updated_time)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
