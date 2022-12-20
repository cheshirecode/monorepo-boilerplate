import { isFunction } from 'lodash-es';
import { useMemo, useState } from 'react';

import useInitialEffect from '@/services/hooks/useInitialEffect';
import { createUrlSearchParams } from '@/services/routes';

import { QueryStringFormProps, QueryStringHookResults } from './typings';

const useQueryStringForm = ({
  queryString,
  onChange,
  persistState = false
}: QueryStringFormProps): QueryStringHookResults => {
  const [queryStr, setQueryStr] = useState(queryString);
  const { q, searchParams, createSetter } = useMemo(() => {
    const q = createUrlSearchParams(queryStr);
    return {
      q,
      // last write wins - k=0&k1=1&k2=2&k=3 > {k: '3', k1: '1', k2: '2'}
      searchParams: Object.fromEntries(q.entries()),
      createSetter: (k: string) => (v: string | number) => {
        q.set(k, v);
        const qs = q.toString();
        if (isFunction(onChange)) {
          onChange(qs);
        }
        setQueryStr(qs);
      }
    };
  }, [onChange, queryStr]);
  // if props change, update unless persistState
  useInitialEffect(() => {
    if (queryString !== queryStr && !persistState) {
      setQueryStr(queryString);
    }
  }, [queryString]);

  return {
    queryStr,
    setQueryStr,
    q,
    searchParams,
    createSetter
  } as const;
};

export default useQueryStringForm;
