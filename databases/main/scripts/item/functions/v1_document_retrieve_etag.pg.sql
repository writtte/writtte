\echo create function schema_item.v1_document_retrieve_etag()
CREATE OR REPLACE FUNCTION schema_item.v1_document_retrieve_etag (p_document_code UUID)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_etag VARCHAR(8);
  v_exception TEXT;
BEGIN
  SELECT
    e_tag INTO v_etag
  FROM
    schema_item.tb_document
  WHERE
    document_code = p_document_code;
  IF v_etag IS NULL THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_RETRIEVED_ETAG', k_message, NULL, k_additional, NULL, k_data, json_build_object('document_code', p_document_code, 'e_tag', v_etag)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
