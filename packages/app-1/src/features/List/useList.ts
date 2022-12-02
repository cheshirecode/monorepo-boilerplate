import { useMemo, useState } from 'react';

import usePagination, { DEFAULT_PAGINATION_THRESHOLD } from '@/components/Pagination/usePagination';
import { deepFilter } from '@/utils';

import type { ListParams } from './typings';

/**
 * data manipulation - takes a list of items with what's needed and returns abstracted getters/setters to help render a filtered and paginated list
 * this is meant to provide atomic handling of individual lists instead of
 *  a giant blob that handles everything OR repeated code for with the text filtering and pagination of different arrays
 * TBD - sorting
 * @param arr unknown[] uniform array
 * @param params
 * @returns filters/pagination params/filtered then paginated list for users to decide
 */
const useList = (
  // TODO - fix generics later
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arr: any[],
  params?: ListParams
) => {
  const { filter: filterParams, pagination: paginationParams } = params ?? {};
  const [filterStr, setFilterStr] = useState(filterParams?.str ?? '');
  const filter = useMemo(
    () => ({
      str: filterStr,
      set: (str: string) => {
        setFilterStr(str);
        if (typeof filterParams?.onChange === 'function') {
          filterParams?.onChange(str);
        }
      }
    }),
    [filterStr, filterParams]
  );
  const [filtered, count] = useMemo(() => {
    const filtered = (filterParams?.fn ?? deepFilter)(arr, filterStr);
    const count = filtered.length;
    // pageSize comes from params

    return [filtered, count];
  }, [arr, filterStr, filterParams?.fn]);

  const pagination = usePagination({
    ...(paginationParams ?? {}),
    page: paginationParams?.page ?? 1,
    pageSize: paginationParams?.pageSize ?? DEFAULT_PAGINATION_THRESHOLD,
    count
  });

  const paginated = useMemo(
    () => filtered.slice(pagination.first, pagination.last + 1),
    [filtered, pagination.first, pagination.last]
  );

  return {
    filter,
    pagination,
    filtered,
    paginated
  } as const;
};

export default useList;
