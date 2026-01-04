\echo create function schema_item.v1_document_update()
CREATE OR REPLACE FUNCTION schema_item.v1_document_update (p_document_code UUID, p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_title VARCHAR(256);
  v_p_lifecycle_state VARCHAR(16);
  v_p_workflow_state VARCHAR(16);
  v_p_e_tag VARCHAR(8);
  v_check_document JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_title := (p_data ->> 'title');
  v_p_lifecycle_state := upper(p_data ->> 'lifecycle_state');
  v_p_workflow_state := upper(p_data ->> 'workflow_state');
  v_p_e_tag := (p_data ->> 'e_tag');
  v_check_document := schema_item.v1_document_check (json_build_object('document_code', p_document_code)::JSONB, TRUE)::JSONB;
  IF v_check_document ->> k_code != 'DOCUMENT_EXISTS' THEN
    RETURN v_check_document;
  END IF;
  UPDATE
    schema_item.tb_document
  SET
    account_code = coalesce(v_p_account_code, account_code),
    title = coalesce(v_p_title, title),
    lifecycle_state = coalesce(v_p_lifecycle_state, lifecycle_state),
    workflow_state = coalesce(v_p_workflow_state, workflow_state),
    e_tag = coalesce(v_p_e_tag, substr(md5(random()::TEXT), 1, 8)),
    updated_time = now()
  WHERE
    document_code = p_document_code;
  IF (v_p_lifecycle_state IS NOT NULL) AND (v_p_lifecycle_state = 'DELETED') THEN
    UPDATE
      schema_item.tb_document
    SET
      deleted_time = now()
    WHERE
      document_code = p_document_code;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('document_code', p_document_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
