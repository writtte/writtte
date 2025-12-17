\echo create function schema_main.v1_subscription_create()
CREATE OR REPLACE FUNCTION schema_main.v1_subscription_create (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_customer_id UUID;
  v_p_seat_count INT;
  v_p_service VARCHAR(32);
  v_p_service_data JSONB;
  v_p_status VARCHAR(16);
  v_id_main BIGINT;
  v_created_time TIMESTAMP WITH TIME ZONE;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_customer_id := (p_data ->> 'customer_id')::UUID;
  v_p_seat_count := coalesce((p_data ->> 'seat_count')::INT, 1);
  v_p_service := (p_data ->> 'service');
  v_p_service_data := coalesce((p_data -> 'service_data')::JSONB, '{}'::JSONB);
  v_p_status := coalesce(upper(p_data ->> 'status'), 'ACTIVE');
  INSERT INTO schema_main.tb_subscription (account_code, customer_id, seat_count, service, service_data, status)
    VALUES (v_p_account_code, v_p_customer_id, v_p_seat_count, v_p_service, v_p_service_data, v_p_status)
  RETURNING
    id_main, created_time INTO v_id_main, v_created_time;
  RETURN json_build_object(k_status, TRUE, k_code, 'SUBSCRIPTION_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('status', v_p_status, 'created_time', v_created_time)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
