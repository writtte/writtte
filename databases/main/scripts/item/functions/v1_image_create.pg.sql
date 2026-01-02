\echo create function schema_item.v1_image_create()
CREATE OR REPLACE FUNCTION schema_item.v1_image_create (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_document_code UUID;
  v_p_image_code UUID;
  v_p_lifecycle_state VARCHAR(16);
  v_image_code UUID;
  v_exception TEXT;
BEGIN
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_p_image_code := (p_data ->> 'image_code')::UUID;
  v_p_lifecycle_state := coalesce(upper(p_data ->> 'lifecycle_state'), 'AVAILABLE');
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
          AND lifecycle_state = 'ACTIVE') INTO v_document_exists;
    IF NOT v_document_exists THEN
      RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
    END IF;
  END;
  INSERT INTO schema_item.tb_image (document_code, image_code, lifecycle_state)
    VALUES (v_p_document_code, v_p_image_code, v_p_lifecycle_state)
  RETURNING
    image_code INTO v_image_code;
  RETURN json_build_object(k_status, TRUE, k_code, 'IMAGE_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('image_code', v_image_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
