\echo create function schema_main.v1_user_update()
CREATE OR REPLACE FUNCTION schema_main.v1_user_update (p_account_code UUID, p_data JSONB)
  RETURNS JSONB VOLATILE
  AS $$
DECLARE
  k_status CONSTANT TEXT := 'status';
  k_code CONSTANT TEXT := 'code';
  k_message CONSTANT TEXT := 'message';
  k_additional CONSTANT TEXT := 'additional';
  k_data CONSTANT TEXT := 'data';
  v_p_email_address VARCHAR(1024);
  v_p_name VARCHAR(512);
  v_p_hashed_password TEXT;
  v_p_password_salt TEXT;
  v_p_status VARCHAR(24);
  v_p_is_email_verified BOOLEAN;
  v_check_user JSONB;
  v_exception TEXT;
BEGIN
  v_p_email_address := lower(p_data ->> 'email_address');
  v_p_name := (p_data ->> 'name');
  v_p_hashed_password := (p_data ->> 'hashed_password');
  v_p_password_salt := (p_data ->> 'password_salt');
  v_p_status := upper(p_data ->> 'status');
  v_p_is_email_verified := (p_data ->> 'is_email_verified')::BOOLEAN;
  v_check_user := schema_main.v1_user_check (json_build_object('email_address', v_p_email_address)::JSONB, TRUE)::JSONB;
  IF v_check_user ->> k_code != 'USER_EXISTS' THEN
    RETURN v_check_user;
  END IF;
  UPDATE
    schema_main.tb_user
  SET
    email_address = coalesce(v_p_email_address, email_address),
    name = coalesce(v_p_name, name),
    hashed_password = coalesce(v_p_hashed_password, hashed_password),
    password_salt = coalesce(v_p_password_salt, password_salt),
    status = coalesce(v_p_status, status),
    is_email_verified = coalesce(v_p_is_email_verified, is_email_verified),
    updated_time = now()
  WHERE
    account_code = p_account_code;
  IF (v_p_status IS NOT NULL) AND (v_p_status = 'PENDING_DELETION') THEN
    UPDATE
      schema_main.tb_user
    SET
      pending_deletion_time = now()
    WHERE
      account_code = p_account_code;
  END IF;
  IF (v_p_status IS NOT NULL) AND (v_p_status = 'DELETED') THEN
    UPDATE
      schema_main.tb_user
    SET
      deleted_time = now()
    WHERE
      account_code = p_account_code;
  END IF;
  RETURN json_build_object(k_status, TRUE, k_code, 'USER_UPDATED', k_message, NULL, k_additional, NULL, k_data, json_build_object('account_code', v_account_code)::JSONB)::JSONB;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_exception = PG_EXCEPTION_CONTEXT;
  RETURN json_build_object(k_status, FALSE, k_code, SQLSTATE, k_message, SQLERRM, k_additional, v_exception, k_data, NULL)::JSONB;
END;

$$
LANGUAGE plpgsql;
