\echo create function schema_analytics.v1_sharing_views_create()
CREATE OR REPLACE FUNCTION schema_analytics.v1_sharing_views_create (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_page_code VARCHAR(7);
  v_p_visitor_id UUID;
  v_p_current_date DATE;
  v_id_main BIGINT;
  v_views INTEGER;
  v_created_time TIMESTAMP WITH TIME ZONE;
  v_updated_time TIMESTAMP WITH TIME ZONE;
  v_exception TEXT;
  v_record_exists BOOLEAN;
BEGIN
  v_p_page_code := (p_data ->> 'page_code')::VARCHAR(7);
  v_p_visitor_id := (p_data ->> 'visitor_id')::UUID;
  v_p_current_date := coalesce((p_data ->> 'current_date')::DATE, CURRENT_DATE);
  SELECT
    EXISTS (
      SELECT
        1
      FROM
        schema_analytics.tb_sharing_views
      WHERE
        page_code = v_p_page_code
        AND visitor_id = v_p_visitor_id
        AND date(created_time) = v_p_current_date) INTO v_record_exists;
  IF v_record_exists THEN
    UPDATE
      schema_analytics.tb_sharing_views
    SET
      views = views + 1,
      updated_time = now()
    WHERE
      page_code = v_p_page_code
      AND visitor_id = v_p_visitor_id
      AND date(created_time) = v_p_current_date
    RETURNING
      id_main,
      views,
      created_time,
      updated_time INTO v_id_main,
      v_views,
      v_created_time,
      v_updated_time;
    RETURN json_build_object(k_status, TRUE, k_code, 'SHARING_VIEW_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('id_main', v_id_main, 'page_code', v_p_page_code, 'visitor_id', v_p_visitor_id, 'views', v_views, 'created_time', v_created_time, 'updated_time', v_updated_time)::JSONB)::JSONB;
  ELSE
    INSERT INTO schema_analytics.tb_sharing_views (page_code, visitor_id, views, created_time)
      VALUES (v_p_page_code, v_p_visitor_id, 1, now())
    RETURNING
      id_main, views, created_time INTO v_id_main, v_views, v_created_time;
    RETURN json_build_object(k_status, TRUE, k_code, 'SHARING_VIEW_CREATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('id_main', v_id_main, 'page_code', v_p_page_code, 'visitor_id', v_p_visitor_id, 'views', v_views, 'created_time', v_created_time)::JSONB)::JSONB;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
