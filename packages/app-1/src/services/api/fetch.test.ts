import { renderHook, waitFor } from '@testing-library/react';
import stringify from 'fast-json-stable-stringify';
import type { Request } from 'miragejs';
import { describe, expect, it, vi } from 'vitest';

import { makeServer, seeds } from '@/services/mocks/server';
import { NoCacheWrapper, render } from '@/services/tests/helpers';
import type { Server } from '@/typings/mirage';

import {
  createHeaderMiddleware,
  createValidationMiddleware,
  logger,
  useGet,
  useGets,
  useMutation,
  validateResponse
} from './fetch';

let server: Server;

const createMockedConsoleLog = () => {
  // eslint-disable-next-line no-console
  const x = console.log;
  const loggerArgs: unknown[] = [];
  const mocked = vi.spyOn(global.console, 'log').mockImplementation((...args: unknown[]) => {
    loggerArgs.push(args);
    if (!(args[0] as string).includes(logger.stdoutMessagePrefix)) {
      x(...args);
    }
  });
  return [mocked, loggerArgs];
};

beforeAll(async () => {
  server = makeServer();
  seeds(server);

  return async () => {
    server.shutdown();
  };
});

beforeEach(async () => {
  return async () => {
    vi.restoreAllMocks();
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
    const [mockedConsoleLog, loggerArgs] = createMockedConsoleLog();
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

  it('2xGET /test', async () => {
    const { result } = renderHook(() => useGets<[Request, Request]>(['/test', '/test']), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(result?.current?.data).toBeUndefined();
      expect(result?.current?.error).toBeUndefined();
    });
  });

  it('POST /test/random?foo=bar with 2 middlewares - logger + custom header', async () => {
    const [mockedConsoleLog, loggerArgs] = createMockedConsoleLog();
    const payload = { payloadFoo: 'payloadBar' };
    const Comp = () => {
      const { data, trigger } = useMutation<Request>(
        '/test/bar?foo=bar',
        { method: 'POST' },
        {
          use: [
            logger<Request>,
            createHeaderMiddleware<Request>({
              'x-swr': '1'
            })
          ]
        }
      );

      return (
        <NoCacheWrapper>
          <button
            onClick={() => {
              trigger(payload);
            }}
          >
            {data ? 'data' : 'trigger'}
          </button>
          <span title="data">{data?.body}</span>
        </NoCacheWrapper>
      );
    };
    const res = render(<Comp />);
    const btn = await res.findByText('trigger');
    btn.click();
    await res.findByText('data');
    const dataNode = await res.findByTitle('data');
    await waitFor(() => {
      expect(mockedConsoleLog).toHaveBeenCalled();
      expect(
        loggerArgs.some((x: unknown[]) => x.indexOf(logger.stdoutMessagePrefix) >= 0),
        'expect stdout to contain logger message'
      ).toBeTruthy();
      expect(dataNode.innerHTML).toEqual(stringify(payload));
    });
  });

  it('PUT /test/random?foo=bar', async () => {
    const payload = { payloadFoo: 'payloadBar' };
    const Comp = () => {
      const { data, trigger } = useMutation<Request>(['/test/bar?foo=bar', { method: 'PUT' }]);

      return (
        <NoCacheWrapper>
          <button
            onClick={() => {
              trigger(payload);
            }}
          >
            {data ? 'data' : 'trigger'}
          </button>
          <span title="data">{data?.body}</span>
        </NoCacheWrapper>
      );
    };
    const res = render(<Comp />);
    const btn = await res.findByText('trigger');
    btn.click();
    await res.findByText('data');
    const dataNode = await res.findByTitle('data');

    expect(dataNode.innerHTML).toEqual(stringify(payload));
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
              actual: expect.any(Object),
              expected: expect.any(Array)
            })
          ])
        })
      ])
    );
  });
});
