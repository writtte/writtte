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
    [HTTP_STATUS.BAD_REQUEST]: langKeys().ErrorApiBadRequest,
    [HTTP_STATUS.UNAUTHORIZED]: langKeys().ErrorApiUnauthorized,
    [HTTP_STATUS.FORBIDDEN]: langKeys().ErrorApiForbidden,
    [HTTP_STATUS.NOT_FOUND]: langKeys().ErrorApiNotFound,
    [HTTP_STATUS.CONFLICT]: langKeys().ErrorApiConflict,
    [HTTP_STATUS.TOO_MANY_REQUESTS]: langKeys().ErrorApiTooManyRequests,
    [HTTP_STATUS.NOT_IMPLEMENTED]: langKeys().ErrorApiNotImplemented,
    [HTTP_STATUS.BAD_GATEWAY]: langKeys().ErrorApiBadGateway,
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: langKeys().ErrorApiServiceUnavailable,
    [HTTP_STATUS.GATEWAY_TIMEOUT]: langKeys().ErrorApiGatewayTimeout,
  };

  return errorMapping[status] || langKeys().ErrorApiInternalServerError;
};

export type { TApiErrorTranslations };

export { handleHTTPError };
