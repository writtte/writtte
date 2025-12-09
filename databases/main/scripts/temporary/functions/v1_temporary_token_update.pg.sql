\echo create function schema_temporary.v1_temporary_token_update()
CREATE OR REPLACE FUNCTION schema_temporary.v1_temporary_token_update (p_data JSONB)
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
  v_token JSONB;
  v_is_expired BOOLEAN;
  v_updated_count INT;
  v_exception TEXT;
BEGIN
  v_p_type := (p_data ->> 'type');
  v_p_key := (p_data ->> 'key');
  v_p_value := (p_data ->> 'value');
  SELECT
    json_build_object('type', tbt.type, 'key', tbt.key, 'value', tbt.value, 'status', tbt.status, 'expiration_time', tbt.expiration_time, 'created_time', tbt.created_time, 'updated_time', tbt.updated_time)::JSONB INTO v_token
  FROM
    schema_temporary.tb_temporary_token tbt
  WHERE
    tbt.type = v_p_type
    AND tbt.key = v_p_key
    AND tbt.value = v_p_value
  LIMIT 1;
  IF v_token IS NULL THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'TEMPORARY_TOKEN_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  v_is_expired := ((v_token ->> 'expiration_time')::TIMESTAMPTZ < now());
  UPDATE
    schema_temporary.tb_temporary_token
  SET
    status = 'USED',
    updated_time = now()
  WHERE
    key = v_p_key
    AND value = v_p_value
  RETURNING
    1 INTO v_updated_count;
  IF v_is_expired THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'TEMPORARY_TOKEN_EXPIRED', k_message, NULL, k_additional, NULL, k_data, v_token)::JSONB;
  ELSE
    RETURN json_build_object(k_status, TRUE, k_code, 'TEMPORARY_TOKEN_USED', k_message, NULL, k_additional, NULL, k_data, v_token)::JSONB;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
