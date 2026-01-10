\echo create function schema_item.v1_tree_retrieve_folder_documents()
CREATE OR REPLACE FUNCTION schema_item.v1_tree_retrieve_folder_documents (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_folder_code UUID;
  v_p_page INTEGER;
  v_p_page_size INTEGER;
  v_check_folder JSONB;
  v_result RECORD;
  v_exception TEXT;
  v_query TEXT;
  v_total_pages INTEGER;
BEGIN
  v_p_folder_code := (p_data ->> 'folder_code')::UUID;
  v_p_page := GREATEST (coalesce((p_data ->> 'page')::INTEGER, 1), 1);
  v_p_page_size := LEAST (GREATEST (coalesce((p_data ->> 'page_size')::INTEGER, 10), 1), 100);
  v_check_folder := schema_item.v1_folder_check (json_build_object('folder_code', v_p_folder_code)::JSONB, TRUE)::JSONB;
  IF v_check_folder ->> k_code != 'FOLDER_EXISTS' THEN
    RETURN v_check_folder;
  END IF;
  v_query := format('
    SELECT
      COALESCE(json_agg(doc_data), ''[]''::JSON) as documents,
      COALESCE(MAX(total_count), 0) as total_count
    FROM (
      SELECT
        json_build_object(
          ''document_code'', tbd.document_code,
          ''account_code'', tbd.account_code,
          ''title'', tbd.title,
          ''lifecycle_state'', tbd.lifecycle_state,
          ''workflow_state'', tbd.workflow_state,
          ''e_tag'', tbd.e_tag,
          ''created_time'', tbd.created_time,
          ''updated_time'', tbd.updated_time
        ) as doc_data,
        COUNT(*) OVER() as total_count
      FROM schema_item.tb_tree tbt
      INNER JOIN schema_item.tb_document tbd ON tbt.document_code = tbd.document_code
      WHERE tbt.folder_code = %L
      ORDER BY tbt.created_time DESC
      LIMIT %L OFFSET %L
    ) sub', v_p_folder_code, v_p_page_size, (v_p_page - 1) * v_p_page_size);
  EXECUTE v_query INTO v_result;
  v_total_pages := ceil(v_result.total_count::NUMERIC / v_p_page_size::NUMERIC)::INTEGER;
  IF v_total_pages = 0 THEN
    v_total_pages := 1;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'TREE_FOLDER_DOCUMENTS_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, json_build_object('folder_code', v_p_folder_code, 'documents', v_result.documents::JSONB, 'pagination', json_build_object('current_page', v_p_page, 'page_size', v_p_page_size, 'total_count', v_result.total_count, 'total_pages', v_total_pages)))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
