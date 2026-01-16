\echo create function schema_analytics.v1_sharing_views_retrieve_list()
CREATE OR REPLACE FUNCTION schema_analytics.v1_sharing_views_retrieve_list (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_page_code VARCHAR(7);
  v_p_date_range INTEGER;
  v_start_date DATE;
  v_end_date DATE;
  v_result JSONB;
  v_exception TEXT;
BEGIN
  v_p_page_code := (p_data ->> 'page_code')::VARCHAR(7);
  v_p_date_range := coalesce((p_data ->> 'date_range')::INTEGER, 7);
  v_end_date := CURRENT_DATE;
  v_start_date := v_end_date - (v_p_date_range - 1);
  WITH date_series AS (
    SELECT
      generate_series(v_start_date, v_end_date, interval '1 day')::DATE AS day_date
),
daily_views AS (
  SELECT
    date(created_time) AS day_date,
  sum(views) AS total_views
FROM
  schema_analytics.tb_sharing_views
  WHERE
    page_code = v_p_page_code
    AND date(created_time) BETWEEN v_start_date AND v_end_date
  GROUP BY
    date(created_time)
),
unique_views AS (
  SELECT
    date(created_time) AS day_date,
    count(*) AS unique_count
  FROM
    schema_analytics.tb_sharing_views
  WHERE
    page_code = v_p_page_code
    AND date(created_time) BETWEEN v_start_date AND v_end_date
  GROUP BY
    date(created_time))
SELECT
  json_agg(json_build_object('date', to_char(ds.day_date, 'YYYY-MM-DD'), 'views', coalesce(dv.total_views, 0), 'unique_views', coalesce(uv.unique_count, 0))
  ORDER BY ds.day_date) INTO v_result
FROM
  date_series ds
  LEFT JOIN daily_views dv ON ds.day_date = dv.day_date
  LEFT JOIN unique_views uv ON ds.day_date = uv.day_date;
  RETURN json_build_object(k_status, TRUE, k_code, 'SHARING_VIEW_RETRIEVED_LIST', k_message, NULL, k_additional, NULL, k_data, json_build_object('page_code', v_p_page_code, 'date_range', v_p_date_range, 'start_date', v_start_date, 'end_date', v_end_date, 'daily_analytics', coalesce(v_result, '[]'::JSONB)))::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
