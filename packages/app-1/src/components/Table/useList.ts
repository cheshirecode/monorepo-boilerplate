import { useMemo, useState } from 'react';

import type { PaginationInputs } from '@/components/Pagination';
import usePagination from '@/components/Pagination/usePagination';
import { deepFilter } from '@/utils';

export const DEFAULT_PAGINATION_THRESHOLD = 10;

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
  params?: {
    filter?: {
      str: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fn?: (arr: any[], str: string) => any[];
      onChange?: (str: string) => void;
    };
    pagination?: Partial<PaginationInputs>;
  }
) => {
  const [filterStr, setFilterStr] = useState(params?.filter?.str ?? '');
  const filter = useMemo(
    () => ({
      str: filterStr,
      set: (str: string) => {
        setFilterStr(str);
        if (typeof params?.filter?.onChange === 'function') {
          params?.filter?.onChange(str);
        }
      }
    }),
    [filterStr, params?.filter]
  );
  const [filtered, count] = useMemo(() => {
    const filtered = (params?.filter?.fn ?? deepFilter)(arr, filterStr);
    const count = filtered.length;
    // pageSize comes from params

    return [filtered, count];
  }, [arr, filterStr, params?.filter?.fn]);

  const pagination = usePagination({
    ...(params?.pagination ?? {}),
    page: params?.pagination?.page ?? 1,
    pageSize: params?.pagination?.pageSize ?? DEFAULT_PAGINATION_THRESHOLD,
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
