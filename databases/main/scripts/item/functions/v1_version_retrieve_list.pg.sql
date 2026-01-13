\echo create function schema_item.v1_version_retrieve_list()
CREATE OR REPLACE FUNCTION schema_item.v1_version_retrieve_list (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_document_code UUID;
  v_p_stored_type VARCHAR(16);
  v_p_page INTEGER;
  v_p_page_size INTEGER;
  v_p_sort_order TEXT;
  v_check_document JSONB;
  v_result RECORD;
  v_exception TEXT;
  v_query TEXT;
  v_where_conditions TEXT[];
  v_total_pages INTEGER;
BEGIN
  v_p_document_code := (p_data ->> 'document_code')::UUID;
  v_p_stored_type := upper(p_data ->> 'stored_type');
  v_p_page := GREATEST (coalesce((p_data ->> 'page')::INTEGER, 1), 1);
  v_p_page_size := LEAST (GREATEST (coalesce((p_data ->> 'page_size')::INTEGER, 10), 1), 100);
  v_p_sort_order := coalesce(upper(p_data ->> 'sort_order'), 'DESC');
  IF v_p_sort_order NOT IN ('ASC', 'DESC') THEN
    v_p_sort_order := 'DESC';
  END IF;
  IF v_p_document_code IS NOT NULL THEN
    v_check_document := schema_item.v1_document_check (json_build_object('document_code', v_p_document_code)::JSONB, TRUE)::JSONB;
    IF v_check_document ->> k_code != 'DOCUMENT_EXISTS' THEN
      RETURN v_check_document;
    END IF;
  END IF;
  v_where_conditions := ARRAY[]::TEXT[];
  IF v_p_document_code IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, format('document_code = %L', v_p_document_code));
  END IF;
  IF v_p_stored_type IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, format('stored_type = %L', v_p_stored_type));
  END IF;
  v_query := format('
    SELECT
      COALESCE(json_agg(version_data), ''[]''::JSON) as versions,
      COALESCE(MAX(total_count), 0) as total_count
    FROM (
      SELECT
        json_build_object(
          ''id_main'', id_main,
          ''version_code'', version_code,
          ''document_code'', document_code,
          ''stored_type'', stored_type,
          ''created_time'', created_time
        ) as version_data,
        COUNT(*) OVER() as total_count
      FROM schema_item.tb_version
      %s
      ORDER BY created_time %s
      LIMIT %L OFFSET %L
    ) sub', CASE WHEN array_length(v_where_conditions, 1) > 0 THEN
      'WHERE ' || array_to_string(v_where_conditions, ' AND ')
    ELSE
      ''
    END, v_p_sort_order, v_p_page_size, (v_p_page - 1) * v_p_page_size);
  EXECUTE v_query INTO v_result;
  v_total_pages := ceil(v_result.total_count::NUMERIC / v_p_page_size::NUMERIC)::INTEGER;
  IF v_total_pages = 0 THEN
    v_total_pages := 1;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'VERSION_RETRIEVED_LIST', k_message, NULL, k_additional, NULL, k_data, json_build_object('versions', v_result.versions::JSONB, 'pagination', json_build_object('current_page', v_p_page, 'page_size', v_p_page_size, 'total_count', v_result.total_count, 'total_pages', v_total_pages)))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
