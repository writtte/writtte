\echo create function schema_item.v1_document_create()
CREATE OR REPLACE FUNCTION schema_item.v1_document_create (p_data JSONB)
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
  v_document_code UUID;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_title := (p_data ->> 'title');
  v_p_lifecycle_state := coalesce(upper(p_data ->> 'lifecycle_state'), 'ACTIVE');
  v_p_workflow_state := coalesce(upper(p_data ->> 'workflow_state'), 'PUBLISHED');
  v_p_e_tag := coalesce(p_data ->> 'e_tag', substr(md5(random()::TEXT), 1, 8));
  DECLARE v_account_exists BOOLEAN;
  BEGIN
    SELECT
      EXISTS (
        SELECT
          1
        FROM
          schema_main.tb_user
        WHERE
          account_code = v_p_account_code
          AND status = 'ACTIVE') INTO v_account_exists;
    IF NOT v_account_exists THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'USER_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
    END IF;
  END;
  INSERT INTO schema_item.tb_document (account_code, title, lifecycle_state, workflow_state, e_tag)
    VALUES (v_p_account_code, v_p_title, v_p_lifecycle_state, v_p_workflow_state, v_p_e_tag)
  RETURNING
    document_code INTO v_document_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('document_code', v_document_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
