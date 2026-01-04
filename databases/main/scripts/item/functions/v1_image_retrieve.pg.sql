\echo create function schema_item.v1_image_retrieve()
CREATE OR REPLACE FUNCTION schema_item.v1_image_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_image_code UUID;
  v_p_document_code UUID;
  v_check_image JSONB;
  v_image_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_image_code := (p_data ->> 'image_code')::UUID;
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_check_image := schema_item.v1_image_check (json_build_object('image_code', v_p_image_code, 'document_code', v_p_document_code)::JSONB, TRUE)::JSONB;
  IF v_check_image ->> k_code != 'IMAGE_EXISTS' THEN
    RETURN v_check_image;
  END IF;
  v_image_data := (
    SELECT
      json_build_object('image_code', tbi.image_code, 'document_code', tbi.document_code, 'lifecycle_state', tbi.lifecycle_state, 'created_time', tbi.created_time, 'updated_time', tbi.updated_time, 'deleted_time', tbi.deleted_time)
    FROM
      schema_item.tb_image tbi
    WHERE (v_p_image_code IS NULL
      OR tbi.image_code = v_p_image_code)
    AND (v_p_document_code IS NULL
      OR tbi.document_code = v_p_document_code)
  ORDER BY
    tbi.created_time DESC
  LIMIT 1);
  RETURN json_build_object(k_status, TRUE, k_code, 'IMAGE_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_image_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
