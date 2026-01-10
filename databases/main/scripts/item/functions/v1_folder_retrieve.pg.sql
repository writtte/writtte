\echo create function schema_item.v1_folder_retrieve()
CREATE OR REPLACE FUNCTION schema_item.v1_folder_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_folder_code UUID;
  v_p_account_code UUID;
  v_check_folder JSONB;
  v_folder_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_folder_code := (p_data ->> 'folder_code')::UUID;
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_check_folder := schema_item.v1_folder_check (json_build_object('folder_code', v_p_folder_code, 'account_code', v_p_account_code)::JSONB, TRUE)::JSONB;
  IF v_check_folder ->> k_code != 'FOLDER_EXISTS' THEN
    RETURN v_check_folder;
  END IF;
  v_folder_data := (
    SELECT
      json_build_object('folder_code', tbf.folder_code, 'account_code', tbf.account_code, 'title', tbf.title, 'created_time', tbf.created_time, 'updated_time', tbf.updated_time)
    FROM
      schema_item.tb_folder tbf
    WHERE
      tbf.folder_code = v_p_folder_code
      AND tbf.account_code = v_p_account_code
    ORDER BY
      tbf.created_time DESC
    LIMIT 1);
  RETURN json_build_object(k_status, TRUE, k_code, 'FOLDER_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_folder_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
