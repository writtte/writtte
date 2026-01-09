\echo create function schema_temporary.v1_document_sharing_delete()
CREATE OR REPLACE FUNCTION schema_temporary.v1_document_sharing_delete (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_document_code UUID;
  v_p_sharing_code VARCHAR(17);
  v_deleted_count INTEGER;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_p_sharing_code := (p_data ->> 'sharing_code');
  DELETE FROM schema_temporary.tb_document_sharing
  WHERE account_code = v_p_account_code
    AND document_code = v_p_document_code
    AND sharing_code = v_p_sharing_code;
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  IF v_deleted_count = 0 THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_SHARING_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_SHARING_DELETED', k_message, NULL, k_additional, NULL, k_data, json_build_object('account_code', v_p_account_code, 'document_code', v_p_document_code, 'deleted_count', v_deleted_count)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
