CREATE OR REPLACE FUNCTION schema_item.v1_document_retrieve_list (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_lifecycle_state VARCHAR(16);
  v_p_workflow_state VARCHAR(16);
  v_p_title_filter VARCHAR(256);
  v_p_page INTEGER;
  v_p_page_size INTEGER;
  v_p_sort_by TEXT;
  v_p_sort_order TEXT;
  v_result RECORD;
  v_exception TEXT;
  v_query TEXT;
  v_counter INTEGER := 1;
  v_where_conditions TEXT[];
  v_total_pages INTEGER;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_lifecycle_state := upper(p_data ->> 'lifecycle_state');
  v_p_workflow_state := upper(p_data ->> 'workflow_state');
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
    v_where_conditions := array_append(v_where_conditions, 'account_code = $' || v_counter::TEXT);
    v_counter := v_counter + 1;
  END IF;
  IF v_p_lifecycle_state IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, 'lifecycle_state = $' || v_counter::TEXT);
    v_counter := v_counter + 1;
  ELSE
    v_where_conditions := array_append(v_where_conditions, 'lifecycle_state = $' || v_counter::TEXT);
    v_counter := v_counter + 1;
  END IF;
  IF v_p_workflow_state IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, 'workflow_state = $' || v_counter::TEXT);
    v_counter := v_counter + 1;
  END IF;
  IF v_p_title_filter IS NOT NULL THEN
    v_where_conditions := array_append(v_where_conditions, 'title ILIKE $' || v_counter::TEXT);
    v_counter := v_counter + 1;
  END IF;
  v_query := '
    SELECT 
      COALESCE(json_agg(doc_data), ''[]''::JSON) as documents,
      COALESCE(MAX(total_count), 0) as total_count
    FROM (
      SELECT 
        json_build_object(
          ''document_code'', document_code,
          ''account_code'', account_code,
          ''title'', title,
          ''lifecycle_state'', lifecycle_state,
          ''workflow_state'', workflow_state,
          ''created_time'', created_time,
          ''updated_time'', updated_time
        ) as doc_data,
        COUNT(*) OVER() as total_count
      FROM schema_item.tb_document';
  IF array_length(v_where_conditions, 1) > 0 THEN
    v_query := v_query || ' WHERE ' || array_to_string(v_where_conditions, ' AND ');
  END IF;
  v_query := v_query || ' ORDER BY ' || quote_ident(v_p_sort_by) || ' ' || v_p_sort_order || ' LIMIT $' || v_counter::TEXT || ' OFFSET $' || (v_counter + 1)::TEXT || ') sub';
  IF v_p_account_code IS NOT NULL AND v_p_lifecycle_state IS NOT NULL AND v_p_workflow_state IS NOT NULL AND v_p_title_filter IS NOT NULL THEN
    EXECUTE v_query INTO v_result
    USING v_p_account_code, v_p_lifecycle_state, v_p_workflow_state, '%' || v_p_title_filter || '%', v_p_page_size, (v_p_page - 1) * v_p_page_size;
  ELSIF v_p_account_code IS NOT NULL
      AND v_p_lifecycle_state IS NOT NULL
      AND v_p_workflow_state IS NOT NULL THEN
      EXECUTE v_query INTO v_result
      USING v_p_account_code, v_p_lifecycle_state, v_p_workflow_state, v_p_page_size, (v_p_page - 1) * v_p_page_size;
    ELSIF v_p_account_code IS NOT NULL
        AND v_p_lifecycle_state IS NOT NULL
        AND v_p_title_filter IS NOT NULL THEN
        EXECUTE v_query INTO v_result
        USING v_p_account_code, v_p_lifecycle_state, '%' || v_p_title_filter || '%', v_p_page_size, (v_p_page - 1) * v_p_page_size;
      ELSIF v_p_account_code IS NOT NULL
          AND v_p_lifecycle_state IS NOT NULL THEN
          EXECUTE v_query INTO v_result
          USING v_p_account_code, v_p_lifecycle_state, v_p_page_size, (v_p_page - 1) * v_p_page_size;
        ELSIF v_p_lifecycle_state IS NOT NULL
            AND v_p_workflow_state IS NOT NULL
            AND v_p_title_filter IS NOT NULL THEN
            EXECUTE v_query INTO v_result
            USING v_p_lifecycle_state, v_p_workflow_state, '%' || v_p_title_filter || '%', v_p_page_size, (v_p_page - 1) * v_p_page_size;
          ELSIF v_p_lifecycle_state IS NOT NULL
              AND v_p_workflow_state IS NOT NULL THEN
              EXECUTE v_query INTO v_result
              USING v_p_lifecycle_state, v_p_workflow_state, v_p_page_size, (v_p_page - 1) * v_p_page_size;
            ELSIF v_p_lifecycle_state IS NOT NULL
                AND v_p_title_filter IS NOT NULL THEN
                EXECUTE v_query INTO v_result
                USING v_p_lifecycle_state, '%' || v_p_title_filter || '%', v_p_page_size, (v_p_page - 1) * v_p_page_size;
              ELSIF v_p_lifecycle_state IS NOT NULL THEN
                EXECUTE v_query INTO v_result
                USING v_p_lifecycle_state, v_p_page_size, (v_p_page - 1) * v_p_page_size;
              ELSE
                EXECUTE v_query INTO v_result
                USING v_p_page_size, (v_p_page - 1) * v_p_page_size;
              END IF;
                v_total_pages := ceil(v_result.total_count::NUMERIC / v_p_page_size::NUMERIC)::INTEGER;
                IF v_total_pages = 0 THEN
                  v_total_pages := 1;
                END IF;
                RETURN json_build_object(k_status, TRUE, k_code, 'DOCUMENT_RETRIEVED_LIST', k_message, NULL, k_additional, NULL, k_data, json_build_object('documents', v_result.documents::JSONB, 'pagination', json_build_object('current_page', v_p_page, 'page_size', v_p_page_size, 'total_count', v_result.total_count, 'total_pages', v_total_pages)))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
                RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
