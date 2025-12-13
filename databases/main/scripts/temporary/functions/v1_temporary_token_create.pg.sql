\echo create function schema_temporary.v1_temporary_token_create()
CREATE OR REPLACE FUNCTION schema_temporary.v1_temporary_token_create (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_type VARCHAR(16);
  v_p_key TEXT;
  v_p_value TEXT;
  v_p_expiration_minutes INT;
  v_expiration_time TIMESTAMP WITH TIME ZONE;
  v_exception TEXT;
BEGIN
  v_p_type := (p_data ->> 'type');
  v_p_key := (p_data ->> 'key');
  v_p_value := (p_data ->> 'value');
  v_p_expiration_minutes = (p_data ->> 'expiration_minutes')::INT;
  v_expiration_time := now() + (v_p_expiration_minutes || ' minutes')::INTERVAL;
  INSERT INTO schema_temporary.tb_temporary_token (type, key, value, expiration_time)
    VALUES (v_p_type, v_p_key, v_p_value, v_expiration_time);
  RETURN json_build_object(k_status, TRUE, k_code, 'TEMPORARY_TOKEN_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('value', v_p_value, 'expiration_time', v_expiration_time))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
