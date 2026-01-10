\echo create function schema_item.v1_folder_retrieve_list()
CREATE OR REPLACE FUNCTION schema_item.v1_folder_retrieve_list (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_title_filter VARCHAR(256);
  v_p_page INTEGER;
  v_p_page_size INTEGER;
  v_p_sort_by TEXT;
  v_p_sort_order TEXT;
  v_result RECORD;
  v_exception TEXT;
  v_query TEXT;
  v_where_conditions TEXT[];
  v_total_pages INTEGER;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_title_filter := (p_data ->> 'title_filter');
  v_p_page := GREATEST (coalesce((p_data ->> 'page')::INTEGER, 1), 1);
  v_p_page_size := LEAST (GREATEST (coalesce((p_data ->> 'page_size')::INTEGER, 10), 1), 100);
  v_p_sort_by := coalesce(p_data ->> 'sort_by', 'created_time');
  v_p_sort_order := coalesce(upper(p_data ->> 'sort_order'), 'DESC');
  IF v_p_sort_by NOT IN ('created_time', 'updated_time', 'title') THEN
    v_p_sort_by := 'created_time';
  END IF;
  IF v_p_sort_order NOT IN ('ASC', 'DESC') THEN
    v_p_sort_order := 'DESC';
  END IF;
  v_where_conditions := ARRAY[]::TEXT[];
  IF v_p_account_code IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, format('account_code = %L', v_p_account_code));
  END IF;
  IF v_p_title_filter IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, format('title ILIKE %L', '%' || v_p_title_filter || '%'));
  END IF;
  v_query := format('
    SELECT
      COALESCE(json_agg(folder_data), ''[]''::JSON) as folders,
      COALESCE(MAX(total_count), 0) as total_count
    FROM (
      SELECT
        json_build_object(
          ''folder_code'', folder_code,
          ''account_code'', account_code,
          ''title'', title,
          ''created_time'', created_time,
          ''updated_time'', updated_time
        ) as folder_data,
        COUNT(*) OVER() as total_count
      FROM schema_item.tb_folder
      %s
      ORDER BY %I %s
      LIMIT %L OFFSET %L
    ) sub', CASE WHEN array_length(v_where_conditions, 1) > 0 THEN
      'WHERE ' || array_to_string(v_where_conditions, ' AND ')
    ELSE
      ''
    END, v_p_sort_by, v_p_sort_order, v_p_page_size, (v_p_page - 1) * v_p_page_size);
  EXECUTE v_query INTO v_result;
  v_total_pages := ceil(v_result.total_count::NUMERIC / v_p_page_size::NUMERIC)::INTEGER;
  IF v_total_pages = 0 THEN
    v_total_pages := 1;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'FOLDER_RETRIEVED_LIST', k_message, NULL, k_additional, NULL, k_data, json_build_object('folders', v_result.folders::JSONB, 'pagination', json_build_object('current_page', v_p_page, 'page_size', v_p_page_size, 'total_count', v_result.total_count, 'total_pages', v_total_pages)))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
