\echo create function schema_main.v1_user_retrieve()
CREATE OR REPLACE FUNCTION schema_main.v1_user_retrieve (p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_account_code UUID;
  v_p_email_address VARCHAR(1024);
  v_check_user JSONB;
  v_user_data JSONB;
  v_exception TEXT;
BEGIN
  v_p_account_code := (p_data ->> 'account_code')::UUID;
  v_p_email_address := lower(p_data ->> 'email_address');
  v_check_user := schema_main.v1_user_check (json_build_object('account_code', v_p_account_code, 'email_address', v_p_email_address)::JSONB, TRUE)::JSONB;
  IF v_check_user ->> k_code != 'USER_EXISTS' THEN
    RETURN v_check_user;
  END IF;
  v_user_data := (
    SELECT
      json_build_object('email_address', tbu.email_address, 'name', tbu.name, 'hashed_password', tbu.hashed_password, 'password_salt', tbu.password_salt, 'status', tbu.status, 'is_email_verified', tbu.is_email_verified, 'created_time', tbu.created_time, 'updated_time', tbu.updated_time)
    FROM
      schema_main.tb_user tbu
    WHERE (v_p_account_code IS NOT NULL
      AND tbu.account_code = v_p_account_code)
    OR (v_p_email_address IS NOT NULL
      AND tbu.email_address = v_p_email_address));
  RETURN json_build_object(k_status, TRUE, k_code, 'USER_RETRIEVED', k_message, NULL, k_additional, NULL, k_data, v_user_data)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
