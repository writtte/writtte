const HTTP_STATUS = {
  UNKNOWN: -1,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  LOCKED: 423,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const REQUEST_MODES = {
  CORS: 'cors',
  NO_CORS: 'no-cors',
  SAME_ORIGIN: 'same-origin',
} as const;

const REQUEST_CACHE = {
  NO_CACHE: 'no-cache',
  NO_STORE: 'no-store',
  RELOAD: 'reload',
  FORCE_CACHE: 'force-cache',
  ONLY_IF_CACHED: 'only-if-cached',
} as const;

type TMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

type TRequestMode = (typeof REQUEST_MODES)[keyof typeof REQUEST_MODES];

type TFetchProps = {
  endPoint: string;
  mode: TRequestMode;
  method: TMethod;
  headers?: { key: string; value: string }[];
  queryParams?: {
    key: string;
    value: string | number | boolean | null | undefined;
  }[];
  bodyParams?:
    | Record<string, object | string | number | boolean | null | undefined>
    | undefined;
  xApiKey?: string;
  bearerValue?: string;
};

const fetchRequest = async (
  props: TFetchProps,
): Promise<{ status: number; results: object | null }> => {
  try {
    const queryString = props.queryParams
      ?.map(
        (query) =>
          `${encodeURIComponent(query.key)}=${encodeURIComponent(query.value ?? '')}`,
      )
      .join('&');
    const endPointWithQueries = queryString
      ? `${props.endPoint}?${queryString}`
      : props.endPoint;

    const headers: HeadersInit = {
      'Content-Type': 'text/plain',
    };

    if (props?.headers) {
      props.headers.forEach((header) => {
        headers[header.key] = header.value;
      });
    }

    if (props?.xApiKey) {
      headers['x-api-key'] = props.xApiKey;
    }

    if (props?.bearerValue) {
      headers.Authorization = `Bearer ${props.bearerValue}`;
    }

    const response = await fetch(endPointWithQueries, {
      mode: props.mode,
      cache: REQUEST_CACHE.NO_STORE,
      method: props.method,
      headers,
      body: props?.bodyParams ? JSON.stringify(props.bodyParams) : null,
    });

    let data: object | null = null;
    if (response.status !== HTTP_STATUS.NO_CONTENT) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        try {
          data = (await response.json()) as object;
        } catch {
          data = null;
        }
      } else {
        try {
          const text = await response.text();
          data = text.length > 0 ? (JSON.parse(text) as object) : null;
        } catch {
          data = null;
        }
      }
    }

    return { status: response.status, results: data };
  } catch (error) {
    return { status: -1, results: error as object };
  }
};

export type { TFetchProps };

export { HTTP_STATUS, HTTP_METHODS, REQUEST_MODES, fetchRequest };
