\echo create function schema_temporary.v1_document_sharing_retrieve_list()
CREATE OR REPLACE FUNCTION schema_temporary.v1_document_sharing_retrieve_list (p_data JSONB)
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
  v_result RECORD;
  v_exception TEXT;
  v_query TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  DECLARE v_document_exists BOOLEAN;
  BEGIN
    SELECT
      EXISTS (
        SELECT
          1
        FROM
          schema_item.tb_document
        WHERE
          document_code = v_p_document_code
          AND account_code = v_p_account_code
          AND lifecycle_state = 'ACTIVE') INTO v_document_exists;
    IF NOT v_document_exists THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
    END IF;
  END;
  v_query := format('
    SELECT
      COALESCE(json_agg(sharing_data), ''[]''::JSON) as sharing_list
    FROM (
      SELECT
        json_build_object(
          ''account_code'', account_code,
          ''document_code'', document_code,
          ''sharing_code'', sharing_code,
          ''created_time'', created_time
        ) as sharing_data
      FROM schema_temporary.tb_document_sharing
      WHERE account_code = %L AND document_code = %L
      ORDER BY created_time DESC
    ) sub', v_p_account_code, v_p_document_code);
  EXECUTE v_query INTO v_result;
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_SHARING_RETRIEVED_LIST', k_message, NULL, k_additional, NULL, k_data, json_build_object('sharing_list', v_result.sharing_list::JSONB))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
