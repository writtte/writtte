import { getTr } from '../middleware/setup/translations';

type TLangKeys = {
  CommonErrorApiBadGateway: string;
  CommonErrorApiBadRequest: string;
  CommonErrorApiConflict: string;
  CommonErrorApiForbidden: string;
  CommonErrorApiGatewayTimeout: string;
  CommonErrorApiInternalServerError: string;
  CommonErrorApiNotFound: string;
  CommonErrorApiNotImplemented: string;
  CommonErrorApiServiceUnavailable: string;
  CommonErrorApiTooManyRequests: string;
  CommonErrorApiUnauthorized: string;
  CommonErrorEmailInvalid: string;
  CommonErrorEmailMax: string;
  CommonErrorEmailMin: string;
  CommonErrorEmailRequired: string;
  CommonInputPlaceholderEmailAddress: string;
  PageAuthenticationSignUpButtonSend: string;
  PageAuthenticationSignUpButtonSending: string;
  PageAuthenticationSignUpLinkSignIn: string;
  PageAuthenticationSignUpNoteLegal: string;
  PageAuthenticationSignUpTextSubtitle: string;
  PageAuthenticationSignUpTextTitle: string;
};

const langKeys = (): TLangKeys => {
  // biome-ignore format: Following array should not be formatted
  const keys: TLangKeys = {
    CommonErrorApiBadGateway: getTr('COMMON_ERROR_API_BAD_GATEWAY'),
    CommonErrorApiBadRequest: getTr('COMMON_ERROR_API_BAD_REQUEST'),
    CommonErrorApiConflict: getTr('COMMON_ERROR_API_CONFLICT'),
    CommonErrorApiForbidden: getTr('COMMON_ERROR_API_FORBIDDEN'),
    CommonErrorApiGatewayTimeout: getTr('COMMON_ERROR_API_GATEWAY_TIMEOUT'),
    CommonErrorApiInternalServerError: getTr('COMMON_ERROR_API_INTERNAL_SERVER_ERROR'),
    CommonErrorApiNotFound: getTr('COMMON_ERROR_API_NOT_FOUND'),
    CommonErrorApiNotImplemented: getTr('COMMON_ERROR_API_NOT_IMPLEMENTED'),
    CommonErrorApiServiceUnavailable: getTr('COMMON_ERROR_API_SERVICE_UNAVAILABLE'),
    CommonErrorApiTooManyRequests: getTr('COMMON_ERROR_API_TOO_MANY_REQUESTS'),
    CommonErrorApiUnauthorized: getTr('COMMON_ERROR_API_UNAUTHORIZED'),
    CommonErrorEmailInvalid: getTr('COMMON_ERROR_EMAIL_INVALID'),
    CommonErrorEmailMax: getTr('COMMON_ERROR_EMAIL_MAX'),
    CommonErrorEmailMin: getTr('COMMON_ERROR_EMAIL_MIN'),
    CommonErrorEmailRequired: getTr('COMMON_ERROR_EMAIL_REQUIRED'),
    CommonInputPlaceholderEmailAddress: getTr('COMMON_INPUT_PLACEHOLDER_EMAIL_ADDRESS'),
    PageAuthenticationSignUpButtonSend: getTr('PAGE_AUTHENTICATION_SIGN_UP_BUTTON_SEND'),
    PageAuthenticationSignUpButtonSending: getTr('PAGE_AUTHENTICATION_SIGN_UP_BUTTON_SENDING'),
    PageAuthenticationSignUpLinkSignIn: getTr('PAGE_AUTHENTICATION_SIGN_UP_LINK_SIGN_IN'),
    PageAuthenticationSignUpNoteLegal: getTr('PAGE_AUTHENTICATION_SIGN_UP_NOTE_LEGAL'),
    PageAuthenticationSignUpTextSubtitle: getTr('PAGE_AUTHENTICATION_SIGN_UP_TEXT_SUBTITLE'),
    PageAuthenticationSignUpTextTitle: getTr('PAGE_AUTHENTICATION_SIGN_UP_TEXT_TITLE'),
  }

  return keys;
};

export { langKeys };
