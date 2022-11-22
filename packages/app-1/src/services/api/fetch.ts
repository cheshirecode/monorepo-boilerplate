import { merge } from 'lodash-es';
import useSWR from 'swr';
import type { Key, SWRConfiguration, SWRHook, SWRResponse } from 'swr';
import fetch from 'unfetch';

export type Fetcher = <T>(url: string, options?: RequestInit) => Promise<T>;
export type SWRMiddleware<T> = (
  useSWRNext: SWRHook
) => (key: Key, fetcher: Fetcher, config?: SWRConfiguration) => SWRResponse<T, ErrorHttp>;

// no typing for error limitation https://github.com/microsoft/TypeScript/issues/6283#issuecomment-240804072
export const getRequest: Fetcher = async (url, options = {}) => {
  // @ts-expect-error
  const res = await fetch(url, {
    ...options,
    credentials: 'include'
  });
  // 200 response
  /* c8 ignore next 8 */
  if (res.ok) {
    return res.json();
  }
  // very hard to test error handling
  const error: ErrorHttp = new Error(res.statusText); // non-2xx HTTP responses into errors
  error.info = await res.json();
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
  useSWR<T, ErrorHttp>(
    'POST ' + key,
    (u: Key, o: RequestInit) => postRequest<T>(String(key), merge(options, o)),
    {
      ...config,
      refreshInterval: 0,
      revalidateIfStale: false
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

export const createHeaderMiddleware: <T>(headers: RequestInit['headers']) => SWRMiddleware<T> =
  <T>(headers: RequestInit['headers']) =>
  (useSWRNext) =>
  (key, fetcher, config) =>
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
    );
