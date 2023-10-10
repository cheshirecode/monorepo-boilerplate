import { isFunction } from 'lodash-es';
import { useMemo } from 'react';

import createUrlSearchParams from '@/services/routes/createUrlSearchParams';

import { QueryStringFormProps } from './typings';

const useQueryStringForm = ({
  onQsChange,
  onKeyValueChange,
  onParamsChange,
  data
}: QueryStringFormProps) => {
  const { q, createSetter } = useMemo(() => {
    const q = createUrlSearchParams('', data);
    return {
      q,
      // last write wins - k=0&k1=1&k2=2&k=3 > {k: '3', k1: '1', k2: '2'}
      createSetter: (k: string) => (v: string | number) => {
        q.set(k, v);
        if (isFunction(onQsChange)) {
          onQsChange(q.toString());
        }
        if (isFunction(onKeyValueChange)) {
          onKeyValueChange(k, v);
        }
        if (isFunction(onParamsChange)) {
          onParamsChange(q.entriesAsObj());
        }
      }
    };
  }, [data, onKeyValueChange, onParamsChange, onQsChange]);

  return {
    q,
    createSetter
  } as const;
};

export default useQueryStringForm;
