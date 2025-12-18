\echo create function schema_main.v1_overview_account_retrieve()
CREATE OR REPLACE FUNCTION schema_main.v1_overview_account_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_user_data JSONB;
  v_account_overview JSONB;
  v_subscription_details JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_user_data := (
    SELECT
      json_build_object('account_code', tbu.account_code, 'email_address', tbu.email_address, 'name', tbu.name, 'status', tbu.status, 'is_email_verified', tbu.is_email_verified, 'updated_time', tbu.updated_time)
    FROM
      schema_main.tb_user tbu
    WHERE
      tbu.account_code = v_p_account_code);
  IF v_user_data IS NULL THEN
    RETURN json_build_object(k_status, TRUE, k_code, 'USER_NOT_EXISTS', k_message, NULL, k_additional, NULL, k_data, NULL)::JSONB;
  END IF;
  v_subscription_details := schema_main.v1_subscription_retrieve (json_build_object('account_code', v_p_account_code)::JSONB)::JSONB;
  IF (v_subscription_details ->> k_status)::BOOLEAN THEN
    v_account_overview := json_build_object('user', v_user_data, 'subscription', v_subscription_details -> k_data);
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'OVERVIEW_ACCOUNT_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_account_overview)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
