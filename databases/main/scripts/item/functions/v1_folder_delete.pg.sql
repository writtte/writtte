\echo create function schema_item.v1_folder_delete()
CREATE OR REPLACE FUNCTION schema_item.v1_folder_delete (p_folder_code UUID)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_check_folder JSONB;
  v_has_documents BOOLEAN;
  v_exception TEXT;
BEGIN
  v_check_folder := schema_item.v1_folder_check (json_build_object('folder_code', p_folder_code)::JSONB, TRUE)::JSONB;
  IF v_check_folder ->> k_code != 'FOLDER_EXISTS' THEN
    RETURN v_check_folder;
  END IF;
  SELECT
    EXISTS (
      SELECT
        1
      FROM
        schema_item.tb_tree
      WHERE
        folder_code = p_folder_code) INTO v_has_documents;
  IF v_has_documents THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'FOLDER_HAS_DOCUMENTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  DELETE FROM schema_item.tb_folder
  WHERE folder_code = p_folder_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'FOLDER_DELETED', k_message, NULL, k_additional, NULL, k_data, json_build_object('folder_code', p_folder_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
