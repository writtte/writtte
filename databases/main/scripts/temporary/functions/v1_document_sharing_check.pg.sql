\echo create function schema_temporary.v1_document_sharing_check()
CREATE OR REPLACE FUNCTION schema_temporary.v1_document_sharing_check (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_sharing_code VARCHAR(7);
  v_document_code UUID;
  v_account_code UUID;
  v_exists BOOLEAN;
  v_exception TEXT;
BEGIN
  v_p_sharing_code := (p_data ->> 'sharing_code');
  SELECT
    document_code,
    account_code,
    EXISTS (
      SELECT
        1
      FROM
        schema_temporary.tb_document_sharing
      WHERE
        sharing_code = v_p_sharing_code) INTO v_document_code,
    v_account_code,
    v_exists
  FROM
    schema_temporary.tb_document_sharing
  WHERE
    sharing_code = v_p_sharing_code;
  IF NOT v_exists THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_SHARING_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  DECLARE v_document_active BOOLEAN;
  BEGIN
    SELECT
      EXISTS (
        SELECT
          1
        FROM
          schema_item.tb_document
        WHERE
          document_code = v_document_code
          AND lifecycle_state = 'ACTIVE') INTO v_document_active;
    IF NOT v_document_active THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
    END IF;
  END;
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_SHARING_EXISTS', k_message, NULL, k_additional, NULL, k_data, json_build_object('available', TRUE, 'account_code', v_account_code, 'document_code', v_document_code))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
