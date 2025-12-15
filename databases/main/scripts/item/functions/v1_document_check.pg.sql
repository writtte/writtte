\echo create function schema_item.v1_document_check()
CREATE OR REPLACE FUNCTION schema_item.v1_document_check (p_data JSONB, p_is_for_exists BOOLEAN)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_document_code UUID;
  v_p_account_code UUID;
  v_document_exists BOOLEAN;
  v_exception TEXT;
BEGIN
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  SELECT
    EXISTS (
      SELECT
        1
      FROM
        schema_item.tb_document
      WHERE (v_p_document_code IS NOT NULL
        AND document_code = v_p_document_code)
      OR (v_p_account_code IS NOT NULL
        AND account_code = v_p_account_code)) INTO v_document_exists;
  IF p_is_for_exists AND v_document_exists THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  ELSIF p_is_for_exists
      AND NOT v_document_exists THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  ELSIF NOT p_is_for_exists
      AND v_document_exists THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  ELSIF NOT p_is_for_exists
      AND NOT v_document_exists THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
