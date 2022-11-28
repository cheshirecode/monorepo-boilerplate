import { useCallback, useEffect, useMemo, useState } from 'react';

import { deepFilter, getPageSizeOptions } from '@/utils';

import type { PaginationProps } from './';
import { DEFAULT_PROPS as DEFAULT_PAGINATION_PROPS } from './';
/**
 * helper utility to take a list of items, returns abstracted getters/setters to help render a filtered and paginated list
 * this is meant to provide atomic handling of individual lists instead of
 *  a giant blob that handles everything OR repeated code for with the text filtering and pagination of different arrays
 * TBD - sorting
 *
 * @param arr unknown[] uniform array
 * @param paginationThreshold number | boolean default - 10. number of entries per page. Set to false to disable pagination.
 * @returns filters/pagination params/filtered then paginated list for users to decide
 */
const useListCollation = (arr: unknown[], paginationThreshold: number | boolean = 10) => {
  const [filter, setFilter] = useState('');
  const filtered = useMemo(() => deepFilter<typeof arr>(arr, filter), [arr, filter]);
  const [pagination, _setPagination] = useState<PaginationProps>(DEFAULT_PAGINATION_PROPS);
  const setPagination = useCallback<PaginationProps['onChange']>((e, params) => {
    _setPagination((s) => ({
      ...s,
      ...params,
      ...(params?.page ? { initialPage: params?.page } : {})
    }));
  }, []);

  useEffect(() => {
    const l = filtered.length;

    _setPagination((s) => ({
      ...s,
      count: l,
      itemsPerPage:
        paginationThreshold === ~~paginationThreshold &&
        paginationThreshold > 0 &&
        l > paginationThreshold
          ? getPageSizeOptions([], l)[0]
          : Math.max(filtered.length, 10)
    }));
  }, [filtered.length, paginationThreshold, setPagination]);

  const paginated = useMemo(
    () => filtered.slice(pagination.first, pagination.last + 1),
    [filtered, pagination.first, pagination.last]
  );

  return {
    filter,
    setFilter,
    pagination,
    setPagination,
    filtered,
    paginated
  } as const;
};

export default useListCollation;
