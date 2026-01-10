\echo create function schema_item.v1_folder_update()
CREATE OR REPLACE FUNCTION schema_item.v1_folder_update (p_folder_code UUID, p_data JSONB)
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
  v_check_folder JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_title := (p_data ->> 'title');
  v_check_folder := schema_item.v1_folder_check (json_build_object('folder_code', p_folder_code)::JSONB, TRUE)::JSONB;
  IF v_check_folder ->> k_code != 'FOLDER_EXISTS' THEN
    RETURN v_check_folder;
  END IF;
  UPDATE
    schema_item.tb_folder
  SET
    account_code = coalesce(v_p_account_code, account_code),
    title = coalesce(v_p_title, title),
    updated_time = now()
  WHERE
    folder_code = p_folder_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'FOLDER_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('folder_code', p_folder_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
