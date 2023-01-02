import stringify from 'fast-json-stable-stringify';
import fetch from 'isomorphic-unfetch';
import { merge } from 'lodash-es';
import type { Key, SWRConfiguration, SWRHook, SWRResponse } from 'swr';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

export type Fetcher = <T>(url: string, options?: RequestInit) => Promise<T>;
export type SWRMiddleware<T> = (
  useSWRNext: SWRHook
) => (key: Key, fetcher: Fetcher, config?: SWRConfiguration) => SWRResponse<T, ErrorHttp>;

// no typing for error limitation https://github.com/microsoft/TypeScript/issues/6283#issuecomment-240804072
export const getRequest: Fetcher = async (url, options = {}) => {
  // flag specific for testing with happy-dom
  // NOTE - in browser, process.env is undefined so only check in vitest/jest env (for headless browser, rethink)
  const isTestingInHappyDom = import.meta.env.MODE === 'test' && !!process?.env?.NODE_HAPPY_DOM;

  const isImage = options?.headers ? options?.headers['Content-Type']?.startsWith('image/') : false;
  if (isImage) {
    return getBlob(url, options);
  }
  // @ts-expect-error
  const res = await fetch(url, {
    ...options,
    credentials: 'include'
  });
  // 200 response
  /* c8 ignore next 8 */
  if (res.ok) {
    return !isTestingInHappyDom ? await res?.json() : res;
  }
  // very hard to test error handling
  const error: ErrorHttp = new Error(res.statusText); // non-2xx HTTP responses into errors
  // flag specific for testing with happy-dom
  error.info = !isTestingInHappyDom ? await res?.json() : stringify(res);
  error.status = res.status;
  return error;
};

export const getBlob: Fetcher = async (url, options = {}) => {
  // @ts-expect-error
  const res = await fetch(url, {
    ...options,
    credentials: 'include'
  });
  // 200 response
  /* c8 ignore next 8 */
  if (res.ok) {
    return res.blob();
  }
  // very hard to test error handling
  const error: ErrorHttp = new Error(res.statusText); // non-2xx HTTP responses into errors
  error.info = await res.blob();
  error.status = res.status;
  return error;
};

export const postRequest = <T>(url: string, options: RequestInit = {}) =>
  getRequest<T>(
    url,
    merge(options, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  );

export const useGet = <T>(key: Key, config?: SWRConfiguration) =>
  useSWR<T, ErrorHttp>(key, getRequest<T>, config);

export const usePost = <T>(key: Key, options: RequestInit, config?: SWRConfiguration) =>
  useSWRImmutable<T, ErrorHttp>(
    'POST ' + key,
    (u: Key, o: RequestInit) => postRequest<T>(String(key), merge(options, o)),
    {
      ...config
    }
  );

export const logger =
  <T>(useSWRNext: SWRHook) =>
  (key: Key, fetcher: Fetcher, config?: SWRConfiguration) =>
    useSWRNext<T, ErrorHttp>(
      key,
      (...args: Parameters<Fetcher>) => {
        // eslint-disable-next-line no-console
        console.log('SWR Request:', key, fetcher, config);
        return fetcher<T>(...args);
      },
      config
    );
logger.stdoutMessagePrefix = 'SWR Request:';

export const createHeaderMiddleware = <T>(headers: RequestInit['headers']) =>
  ((useSWRNext) => (key, fetcher, config) =>
    useSWRNext<T, ErrorHttp>(
      key,
      (...args: Parameters<Fetcher>) =>
        fetcher<T>(
          args[0],
          merge(
            {
              headers
            },
            args[1] ?? {}
          )
        ),
      config
    )) as SWRMiddleware<T>;

const _defaultIsValid = <T>(_d: T) => true;

export const validateResponse = <T>(
  data: T | ErrorHttp,
  error: ErrorHttp | undefined,
  isValid: (d: T) => boolean = _defaultIsValid<T>,
  sampleData: T
) => {
  const errorMessages = [];

  if (!isValid(data)) {
    if (data?.info?.message) {
      errorMessages.push({
        title: 'Unexpected error',
        status: data?.status,
        message: data.info.message,
        ...(!import.meta.env.PROD ? { objects: [data] } : {})
      });
    } else {
      errorMessages.push({
        title: 'Invalid data',
        objects: [
          {
            // more accurate than typeof
            expected: Object.prototype.toString.call(sampleData),
            actual: Object.prototype.toString.call(data)
          }
        ]
      });
    }
  }

  if (error?.message) {
    const { message, status, ...rest } = error;
    errorMessages.push({
      title: message,
      status,
      ...(!import.meta.env.PROD ? { errors: [rest] } : {})
    });
  }

  return errorMessages;
};
/**
 * validate API responses and return well-formed error messages
 *
 * @param isValid
 * @param defaultValue
 * @returns
 */
export const createValidationMiddleware = <T>(
  isValid: (d: T) => boolean = _defaultIsValid<T>,
  defaultValue: T
) =>
  ((useSWRNext) => (key, fetcher, config) => {
    const { data, error, isLoading, ...rest } = useSWRNext<T, ErrorHttp>(
      key,
      (...args: Parameters<Fetcher>) => fetcher<T>(...args),
      config
    );
    const errorMessages = validateResponse<T>(data, error, isValid, defaultValue);
    return {
      data: errorMessages.length ? defaultValue : data,
      error: errorMessages.length ? data : error,
      isLoading,
      errorMessages,
      ...rest
    } as const;
  }) as SWRMiddleware<T>;
