import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

type TApiErrorTranslations = {
  badGateway: string;
  badRequest: string;
  conflict: string;
  forbidden: string;
  gatewayTimeout: string;
  internalServerError: string;
  notFound: string;
  notImplemented: string;
  serviceUnavailable: string;
  tooManyRequests: string;
  unauthorized: string;
};

const handleHTTPError = (
  status: number,
  customErrors: Record<number, string> | undefined,
): string => {
  if (customErrors?.[status]) {
    return customErrors[status];
  }

  // biome-ignore format: Following record should not be formatted
  const errorMapping: Record<number, string> = {
    [HTTP_STATUS.BAD_REQUEST]: langKeys().CommonErrorApiBadRequest,
    [HTTP_STATUS.UNAUTHORIZED]: langKeys().CommonErrorApiUnauthorized,
    [HTTP_STATUS.FORBIDDEN]: langKeys().CommonErrorApiForbidden,
    [HTTP_STATUS.NOT_FOUND]: langKeys().CommonErrorApiNotFound,
    [HTTP_STATUS.CONFLICT]: langKeys().CommonErrorApiConflict,
    [HTTP_STATUS.TOO_MANY_REQUESTS]: langKeys().CommonErrorApiTooManyRequests,
    [HTTP_STATUS.NOT_IMPLEMENTED]: langKeys().CommonErrorApiNotImplemented,
    [HTTP_STATUS.BAD_GATEWAY]: langKeys().CommonErrorApiBadGateway,
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: langKeys().CommonErrorApiServiceUnavailable,
    [HTTP_STATUS.GATEWAY_TIMEOUT]: langKeys().CommonErrorApiGatewayTimeout,
  };

  return errorMapping[status] || langKeys().CommonErrorApiInternalServerError;
};

export type { TApiErrorTranslations };

export { handleHTTPError };
