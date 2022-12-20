import { isObject, isUndefined } from 'lodash-es';
import { useCallback } from 'react';
import makeMatcher from 'wouter/matcher';
import useLocation from 'wouter/use-location';

// fn just in case of later dynamism
export const getBaseUrl = (endpoint = '') =>
  `${import.meta.env.VITE_BASE_URL}/${endpoint}`.replace(/(\/{2,})/g, '/');

export const routes = {
  home: getBaseUrl(),
  packages: getBaseUrl('packages'),
  packageVersions: getBaseUrl('package-versions'),
  hosts: getBaseUrl('hosts'),
  dummy: getBaseUrl('dummy'),
  cfuPackage: getBaseUrl('cfu-package'),
  cfuDistGroup: getBaseUrl('cfu-dist-group'),
  packageVersion: getBaseUrl('package-version')
};
/**
 * Wouter custom hook - return query string as well
 *
 * @param options base wouter options for routing
 * @returns
 */
const useQueryString = (options, locationHref = location.href) => {
  // console.log('useQueryString');
  const { pathname, search } = new URL(locationHref);
  const [_location, setLocation] = useLocation(options);
  return [pathname + search, setLocation];
};

/**
 * Wouter custom hook - return query string as well and update document.title based on route name
 *
 * @param options base wouter options for routing
 * @returns
 */
export const useTitleUpdate = (options, locationHref = location.href) => {
  const { pathname } = new URL(locationHref);
  if (document) {
    document.title = pathname
      .slice(1)
      .split('-')
      .map((x) => x.slice(0, 1).toLocaleUpperCase() + x.slice(1))
      .join(' ');
  }
  return useQueryString(options);
};

const defaultMatcher = makeMatcher();
export const multipathMatcher = (patterns, path) => {
  const flattedPatterns = [patterns].flat();
  for (const p of flattedPatterns) {
    const [match, params] = defaultMatcher(p, path);
    if (match) return [match, params];
  }

  return [false, null];
};

export const useRouteMatch = (locationHref = location.href) => {
  const { pathname } = new URL(locationHref);
  const isMatchedRoute = useCallback(
    ({ href }: { href: string } = {}) =>
      href && (pathname === href || (href !== routes.home && pathname?.startsWith(href))),
    [pathname]
  );

  return [isMatchedRoute] as const;
};
interface CURLSearchParams extends URLSearchParams {
  setBulk: (params: Record<string, string>) => CURLSearchParams;
  deleteAll: () => CURLSearchParams;
  appendStr: (str: string) => CURLSearchParams;
  entriesAsObj: () => Record<string, string>;
}
export const createUrlSearchParams = (search = '', params: Record<string, string> = {}) => {
  // coerce search to string or fall back to ''
  const q: CURLSearchParams = new URLSearchParams(
    search?.toString ? search.toString() : string || ''
  );

  Object.assign(q, {
    setBulk: function (params: Record<string, string>) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const t: CURLSearchParams = this;
      Object.keys(isObject(params) ? params : {}).forEach((k) => t.set(k, params[k]));
      return t;
    },
    deleteAll: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const t: CURLSearchParams = this;
      [...t.keys()].forEach((k) => {
        t.delete(k);
      });
      return this;
    },
    entriesAsObj: function () {
      return Object.fromEntries([...this.entries()]);
    }
  });
  q.appendStr = function (str: string) {
    const params = Object.fromEntries(
      [...new URLSearchParams(str).entries()].filter((x) => !isUndefined(x[1]))
    );
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const t: CURLSearchParams = this;
    return t.setBulk(params);
  };
  q.setBulk.bind(q);
  q.deleteAll.bind(q);
  q.appendStr.bind(q);
  // keep setBulk on each instance to reuse
  q.setBulk(params);
  return q;
};

const useLocationSetter = (locationHref, setter: (...args: unknown[]) => void) => {
  const [location, setLocation] = useLocation();
  const finalLocationHref = locationHref ?? location;
  setter = setter ?? setLocation;
  const url = new URL(finalLocationHref);
  return { setter, url } as const;
};

export const queryString = {
  get(x, locationHref = location.href) {
    const { search } = new URL(locationHref);
    const q = new URLSearchParams(search);
    return q.get(x);
  },

  createAppendedUrl(str: string, locationHref = location.href) {
    const url = new URL(locationHref);
    const q = createUrlSearchParams(url.search);
    q.appendStr(str);
    url.search = q.toString();
    return url;
  },

  useSet(
    k: string,
    v: unknown,
    locationHref = location.href,
    setter: (...args: unknown[]) => void
  ) {
    const { setter: finalSetter, url } = useLocationSetter(locationHref, setter);
    const { search } = url;
    const q = createUrlSearchParams(search, { [k]: v });
    url.search = q.toString();
    finalSetter(url.toString());
  },

  useSetBulk(
    params: Record<string, unknown>,
    locationHref = location.href,
    setter: (...args: unknown[]) => void
  ) {
    const { setter: finalSetter, url } = useLocationSetter(locationHref, setter);
    const { search } = url;
    const q = createUrlSearchParams(search, params);
    url.search = q.toString();
    finalSetter(url.toString());
  }

  // useAppendStr(str = '', locationHref = location.href, setter: (...args: unknown[]) => void) {
  //   const { setter: finalSetter, url } = useLocationSetter(locationHref, setter);
  //   const { search } = url;
  //   const q = createUrlSearchParams(search).appendStr(str);
  //   url.search = q.toString();
  //   finalSetter(url.toString());
  // }
};

// export const queryString = new Proxy(_queryString, {
//   get(target, prop, receiver) {
//     if (prop === 'message2') {
//       return 'world';
//     }
//     const value = target[prop];
//     if (value instanceof Function) {
//       return (...args) => value.apply(this === receiver ? target : this, args);
//     }
//     return value;
//   }
// });
