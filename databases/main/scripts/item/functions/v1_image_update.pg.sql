\echo create function schema_item.v1_image_update()
CREATE OR REPLACE FUNCTION schema_item.v1_image_update (p_image_code UUID, p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_lifecycle_state VARCHAR(16);
  v_check_image JSONB;
  v_exception TEXT;
BEGIN
  v_p_lifecycle_state := upper(p_data ->> 'lifecycle_state');
  v_check_image := schema_item.v1_image_check (json_build_object('image_code', p_image_code)::JSONB, TRUE)::JSONB;
  IF v_check_image ->> k_code != 'IMAGE_EXISTS' THEN
    RETURN v_check_image;
  END IF;
  UPDATE
    schema_item.tb_image
  SET
    lifecycle_state = coalesce(v_p_lifecycle_state, lifecycle_state),
    updated_time = now()
  WHERE
    image_code = p_image_code;
  IF (v_p_lifecycle_state IS NOT NULL) AND (v_p_lifecycle_state = 'DELETED') THEN
    UPDATE
      schema_item.tb_image
    SET
      deleted_time = now()
    WHERE
      image_code = p_image_code;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'IMAGE_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('image_code', p_image_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
