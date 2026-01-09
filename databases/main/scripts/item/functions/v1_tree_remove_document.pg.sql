\echo create function schema_item.v1_tree_remove_document()
CREATE OR REPLACE FUNCTION schema_item.v1_tree_remove_document (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_folder_code UUID;
  v_p_document_code UUID;
  v_tree_exists BOOLEAN;
  v_exception TEXT;
BEGIN
  v_p_folder_code := (p_data ->> 'folder_code')::UUID;
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  SELECT
    EXISTS (
      SELECT
        1
      FROM
        schema_item.tb_tree
      WHERE
        folder_code = v_p_folder_code
        AND document_code = v_p_document_code) INTO v_tree_exists;
  IF NOT v_tree_exists THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'TREE_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  DELETE FROM schema_item.tb_tree
  WHERE folder_code = v_p_folder_code
    AND document_code = v_p_document_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'TREE_DOCUMENT_REMOVED', k_message, NULL, k_additional, NULL, k_data, json_build_object('folder_code', v_p_folder_code, 'document_code', v_p_document_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
