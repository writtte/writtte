\echo create function schema_item.v1_version_create()
CREATE OR REPLACE FUNCTION schema_item.v1_version_create (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_document_code UUID;
  v_p_stored_type VARCHAR(16);
  v_p_current_time TIMESTAMP WITH TIME ZONE;
  v_p_time_to_check INTEGER;
  v_check_document JSONB;
  v_version_code UUID;
  v_exception TEXT;
  v_last_version_time TIMESTAMP WITH TIME ZONE;
  v_has_recent_version BOOLEAN;
BEGIN
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_p_stored_type := upper((p_data ->> 'stored_type'));
  v_p_current_time := (p_data ->> 'current_time')::TIMESTAMP WITH TIME ZONE;
  v_p_time_to_check := (p_data ->> 'time_to_check')::INTEGER;
  IF v_p_time_to_check IS NULL THEN
    v_p_time_to_check := 30;
  END IF;
  IF v_p_current_time IS NULL THEN
    v_p_current_time := now();
  END IF;
  v_check_document := schema_item.v1_document_check (json_build_object('document_code', v_p_document_code)::JSONB, TRUE)::JSONB;
  IF v_check_document ->> k_code != 'DOCUMENT_EXISTS' THEN
    RETURN v_check_document;
  END IF;
  SELECT
    created_time INTO v_last_version_time
  FROM
    schema_item.tb_version
  WHERE
    document_code = v_p_document_code
  ORDER BY
    created_time DESC
  LIMIT 1;
  IF v_last_version_time IS NOT NULL AND (v_p_current_time - v_last_version_time) < (v_p_time_to_check || ' minutes')::INTERVAL THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'VERSION_IGNORED', k_message, 'Last version is less than ' || v_p_time_to_check || ' minutes old', k_additional, NULL, k_data, json_build_object('document_code', v_p_document_code, 'last_version_time', v_last_version_time)::JSONB)::JSONB;
  END IF;
  INSERT INTO schema_item.tb_version (document_code, stored_type)
    VALUES (v_p_document_code, v_p_stored_type)
  RETURNING
    version_code INTO v_version_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'VERSION_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('document_code', v_p_document_code, 'version_code', v_version_code, 'stored_type', v_p_stored_type)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
