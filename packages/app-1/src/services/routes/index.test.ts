import { renderHook, waitFor } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import { NoCacheWrapper } from '@/services/tests/helpers';

import { createUrlSearchParams, multipathMatcher, queryString, useRouteMatch } from './';

const jsdom = new JSDOM(``, {
  url: `${location.href}foo?bar=1`
});
const fn = (url) =>
  jsdom.reconfigure({
    url
  });

describe('services/routes', () => {
  it('createUrlSearchParams', () => {
    expect(createUrlSearchParams()).toBeInstanceOf(URLSearchParams);
    expect(createUrlSearchParams('').toString()).toBe('');
    expect(createUrlSearchParams('', 'string').toString()).toBe('');
    const qs = createUrlSearchParams('', { k: 0 });
    expect(qs.toString()).toBe('k=0');
    expect(qs.setBulk({ k1: {} }).toString()).toBe('k=0&k1=%5Bobject+Object%5D');
    expect(qs.setBulk({ k1: 1, k2: 2 }).toString()).toBe('k=0&k1=1&k2=2');
    expect(qs.setBulk({ k2: '' }).toString()).toBe('k=0&k1=1&k2=');
    expect(qs.deleteAll().toString()).toBe('');
    expect(qs.appendStr('k=0&k1=1').toString()).toBe('k=0&k1=1');
    expect(qs.entriesAsObj()).toStrictEqual({
      k: '0',
      k1: '1'
    });
    expect(createUrlSearchParams('?k=0', { k1: 1, k2: 2 }).toString()).toBe('k=0&k1=1&k2=2');
  });

  it('multipathMatcher', () => {
    expect(multipathMatcher(['/foo'], '/foo'), '/foo -> { }').toStrictEqual([true, {}]);
    expect(multipathMatcher(['/foo:rest*'], '/foobar'), `/foobar -> { rest: 'bar' }`).toStrictEqual(
      [true, { rest: 'bar' }]
    );
    expect(multipathMatcher(['/foo:rest*'], '/foo/bar'), '/foo/bar -> null').toStrictEqual([
      false,
      null
    ]);
    expect(
      multipathMatcher(['/foo:rest*', '/foo/:rest*'], '/foo/bar'),
      `/foo/bar -> { rest: 'bar' }`
    ).toStrictEqual([true, { rest: 'bar' }]);
    expect(multipathMatcher(['/foo/:rest*'], '/foo?var=1'), `/foo?var=1 -> null`).toStrictEqual([
      false,
      null
    ]);
    expect(
      multipathMatcher(['/foo/:rest*', '/foo?:rest*'], '/foo?var1=1&var2=2'),
      `/foo?var1=1&var2=2 -> { rest: 'var1=1&var2=2' }`
    ).toStrictEqual([true, { rest: 'var1=1&var2=2' }]);
  });

  it('useRouteMatch', async () => {
    const { result } = renderHook(() => useRouteMatch(jsdom.window.location.href), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      const [isMatchedRoute] = result.current;
      const { pathname } = new URL(jsdom.window.location.href);
      expect(isMatchedRoute({ href: pathname }), pathname).toBeTruthy();
      expect(isMatchedRoute({ href: '/' }), '/').toBeFalsy();
    });
  });

  it('queryString', async () => {
    expect(queryString.get('bar', jsdom.window.location.href), '?bar=1').toEqual('1');
    expect(
      queryString.createAppendedUrl('k=0', jsdom.window.location.href).searchParams.get('k'),
      '?bar=1&k=0'
    ).toEqual('0');

    renderHook(() => queryString.useSet('bar', 2, jsdom.window.location.href, fn), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(queryString.get('bar', jsdom.window.location.href), '?bar=2').toEqual('2');
    });

    renderHook(() => queryString.useSet('newVar', 1, jsdom.window.location.href, fn), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(queryString.get('newVar', jsdom.window.location.href), '?newVar=1').toEqual('1');
    });

    renderHook(() => queryString.useSet('newVar', '', jsdom.window.location.href, fn), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(queryString.get('newVar', jsdom.window.location.href), '?newVar=').toEqual('');
    });

    renderHook(() => queryString.useSetBulk({ k: 0 }, jsdom.window.location.href, fn), {
      wrapper: NoCacheWrapper
    });
    await waitFor(() => {
      expect(queryString.get('k', jsdom.window.location.href), 'k=0').toEqual('0');
    });
  });
});
