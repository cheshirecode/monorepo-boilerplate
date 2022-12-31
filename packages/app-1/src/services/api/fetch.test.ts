import { renderHook, waitFor } from '@testing-library/react';
import stringify from 'fast-json-stable-stringify';
import type { Request } from 'miragejs';
import { describe, expect, it, vi } from 'vitest';

import { makeServer, seeds } from '@/services/mocks/server';
import { NoCacheWrapper } from '@/services/tests/helpers';
import type { Server } from '@/typings/mirage';

import {
  createHeaderMiddleware,
  createValidationMiddleware,
  logger,
  useGet,
  usePost,
  validateResponse
} from './fetch';

let server: Server;

beforeEach(async () => {
  server = makeServer();
  seeds(server);

  return async () => {
    vi.restoreAllMocks();
    server.shutdown();
  };
});

describe('services/api/fetch', () => {
  it('GET null', async () => {
    const { result } = renderHook(() => useGet<undefined>(null), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(result.current.data).toEqual(undefined);
    });
  });

  it('GET /undefined', async () => {
    // // eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
    // const mockedConsoleError = vi.spyOn(global.console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useGet<undefined>('/invalid'), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      // // nonsensical ECONNREFUSED Error
      // expect(result.current.error).toHaveProperty('isTrusted');
      expect(result.current.data).toEqual(undefined);
      // expect(mockedConsoleError).toHaveBeenCalledTimes(1);
    });
  });

  it('GET /test with 1 middleware - logger', async () => {
    // eslint-disable-next-line no-console
    const x = console.log;
    const loggerArgs: unknown[] = [];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockedConsoleLog = vi
      .spyOn(global.console, 'log')
      .mockImplementation((...args: unknown[]) => {
        loggerArgs.push(args);
        if (!(args[0] as string).includes(logger.stdoutMessagePrefix)) {
          x(...args);
        }
      });
    renderHook(() => useGet<undefined>('/test', { use: [logger<undefined>] }), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(mockedConsoleLog).toHaveBeenCalled();
      expect(
        loggerArgs.some((x: unknown[]) => x.indexOf(logger.stdoutMessagePrefix) >= 0),
        'expect stdout to contain logger message'
      ).toBeTruthy();
    });
  });

  it('GET /test with 1 middleware - custom header', async () => {
    const { result } = renderHook(
      () =>
        useGet<Request>('/test', {
          use: [
            createHeaderMiddleware<Request>({
              'x-swr': '1'
            })
          ]
        }),
      {
        wrapper: NoCacheWrapper
      }
    );
    await waitFor(() => {
      expect(result?.current?.data?.headers).toHaveProperty('x-swr');
    });
  });

  it('GET /test with 1 middleware - validation', async () => {
    const { result } = renderHook(
      () =>
        useGet<Request>('/test', {
          use: [createValidationMiddleware<Request>(() => false)]
        }),
      {
        wrapper: NoCacheWrapper
      }
    );
    await waitFor(() => {
      expect(result?.current?.errorMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String)
          })
        ])
      );
    });
  });

  it('GET null', async () => {
    const { result } = renderHook(() => useGet<null>(null), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(result?.current?.data).toBeUndefined();
      expect(result?.current?.error).toBeUndefined();
    });
  });

  it('POST /test/random?foo=bar with 2 middlewares - logger + custom header', async () => {
    // eslint-disable-next-line no-console
    const x = console.log;
    const loggerArgs: unknown[] = [];
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockedConsoleLog = vi
      .spyOn(global.console, 'log')
      .mockImplementation((...args: unknown[]) => {
        loggerArgs.push(args);
        if (!(args[0] as string).includes(logger.stdoutMessagePrefix)) {
          x(...args);
        }
      });
    const payload = { 1: 1 };
    const { result } = renderHook(
      () =>
        usePost<Request>(
          '/test/bar?foo=bar',
          {
            body: stringify(payload)
          },
          {
            use: [
              logger<Request>,
              createHeaderMiddleware<Request>({
                'x-swr': '1'
              })
            ]
          }
        ),
      {
        wrapper: NoCacheWrapper
      }
    );
    await waitFor(() => {
      expect(mockedConsoleLog).toHaveBeenCalled();
      expect(
        loggerArgs.some((x: unknown[]) => x.indexOf(logger.stdoutMessagePrefix) >= 0),
        'expect stdout to contain logger message'
      ).toBeTruthy();
      expect(result?.current?.data?.headers).toHaveProperty('x-swr');
      expect(result?.current?.data?.headers, 'expect POST to have content-type').toHaveProperty(
        'Content-Type'
      );
      expect(result?.current?.data?.body).toMatchObject(stringify(payload));
      expect(result?.current?.data?.params).toMatchObject({ foo: 'bar' });
      expect(result?.current?.data?.queryParams).toEqual({ foo: 'bar' });
    });
  });

  it('validateResponse()', () => {
    const c = (x) => Array.isArray(x);
    let errorMessages = validateResponse([], null, c);
    expect(errorMessages).toStrictEqual<Array>([]);

    errorMessages = validateResponse<[]>({}, null, c, []);
    expect(errorMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          objects: expect.arrayContaining([
            expect.objectContaining({
              actual: expect.any(String),
              expected: expect.any(String)
            })
          ])
        })
      ])
    );
  });
});
