\echo create function schema_main.v1_subscription_retrieve()
CREATE OR REPLACE FUNCTION schema_main.v1_subscription_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_subscription_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  SELECT
    json_build_object('customer_id', s.customer_id, 'seat_count', s.seat_count, 'service', s.service, 'service_data', s.service_data, 'status', s.status, 'created_time', s.created_time, 'updated_time', s.updated_time)::JSONB INTO v_subscription_data
  FROM
    schema_main.tb_subscription s
  WHERE
    s.account_code = v_p_account_code;
  IF v_subscription_data IS NULL THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'SUBSCRIPTION_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'SUBSCRIPTION_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_subscription_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
