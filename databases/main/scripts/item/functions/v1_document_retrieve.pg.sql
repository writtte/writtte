\echo create function schema_item.v1_document_retrieve()
CREATE OR REPLACE FUNCTION schema_item.v1_document_retrieve (p_data JSONB)
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
  v_check_document JSONB;
  v_document_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_check_document := schema_item.v1_document_check (json_build_object('document_code', v_p_document_code, 'account_code', v_p_account_code)::JSONB, TRUE)::JSONB;
  IF v_check_document ->> k_code != 'DOCUMENT_EXISTS' THEN
    RETURN v_check_document;
  END IF;
  v_document_data := (
    SELECT
      json_build_object('document_code', tbd.document_code, 'account_code', tbd.account_code, 'title', tbd.title, 'lifecycle_state', tbd.lifecycle_state, 'workflow_state', tbd.workflow_state, 'e_tag', tbd.e_tag, 'created_time', tbd.created_time, 'updated_time', tbd.updated_time, 'deleted_time', tbd.deleted_time)
    FROM
      schema_item.tb_document tbd
    WHERE
      tbd.document_code = v_p_document_code
      AND tbd.account_code = v_p_account_code
    ORDER BY
      tbd.created_time DESC
    LIMIT 1);
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_document_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
