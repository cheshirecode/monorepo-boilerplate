import { isFunction, isNumber } from 'lodash-es';
import { useMemo, useState } from 'react';

import usePagination from '@/components/Pagination/usePagination';
import useSorting from '@/components/Table/useSorting';

import type { ListParams, ListResults } from './typings';

const noOp = <T>(x: T) => x;
/**
 * data manipulation - takes a list of items with what's needed and returns abstracted getters/setters to help render a filtered and paginated list
 * this is meant to provide atomic handling of individual lists instead of
 *  a giant blob that handles everything OR repeated code for with the text filtering and pagination of different arrays
 * TBD - sorting
 * @param arr unknown[] uniform array
 * @param params
      filter: {
        str: string;
        fn?: ((arr: any[], str: string) => any[])
        onChange?: ((str: string) => void)
      };
      pagination: {
          count: number
        page: number
        pageSize: number
        _pageSize?: number
        onChange?: ((params: Partial<PaginationHookParams>) => void)
        isRollover?: boolean
      },
      sorting: {id, desc}[]
      setSorting: updater
 * @returns filters/pagination params/filtered then paginated list for users to decide
 */
const useList = <T>(
  // TODO - fix generics later
  arr: T[],
  params?: ListParams<T>
): ListResults<T> => {
  if (!Array.isArray(arr)) {
    throw TypeError(
      `useList - invalid arr type. Received ${typeof arr} - ${arr} instead of Array`,
      {
        cause: `${typeof arr} instead of Array`
      }
    );
  }
  const {
    filter: { str = '', onChange, fn = noOp<T[]> } = {},
    pagination: paginationParams,
    postProcess = noOp<T[]>,
    sorting: _sorting = []
  } = params ?? {};
  const [filterStr, setFilterStr] = useState(str);
  // filter out applicable ids (if availble in dataset)
  const [unsorted, baseSorting] = useMemo(
    () => [
      arr.slice(0),
      arr[0]
        ? _sorting
            ?.filter(({ id }) => arr[0] && arr[0][id] !== undefined)
            .map((f) => ({
              ...f,
              _isNumber: isNumber(arr[0][f.id])
            }))
        : _sorting
    ],
    [_sorting, arr]
  );

  const [sorting, setSorting] = useSorting(baseSorting);

  const filter = useMemo(
    () => ({
      str: filterStr,
      set: (str: string) => {
        // skip updates if no new chanages
        if (str === filterStr) {
          return;
        }
        setFilterStr(str);
        if (isFunction(onChange)) {
          onChange(str);
        }
      }
    }),
    [filterStr, onChange]
  );

  const filtered = useMemo(() => {
    sorting
      ?.slice(0)
      ?.reverse()
      ?.map(({ id, desc, _isNumber }) => {
        unsorted.sort((a, b) => {
          if (_isNumber) {
            return desc ? b[id] - a[id] : a[id] - b[id];
          }
          return String(desc ? b[id] : a[id]).localeCompare(desc ? a[id] : b[id]);
        });
      });

    return fn(unsorted, filterStr);
  }, [unsorted, sorting, filterStr, fn]);

  const pagination = usePagination({
    ...(paginationParams ?? {}),
    page: paginationParams?.page ?? 1,
    pageSize: paginationParams === false ? filtered?.length ?? 0 : paginationParams?.pageSize,
    count: filtered?.length ?? 0
  });

  const paginated = useMemo(
    () =>
      postProcess(
        pagination.last + 1 - pagination.last === filtered.length
          ? filtered
          : filtered.slice(pagination.first, pagination.last + 1)
      ),
    [filtered, pagination.first, pagination.last, postProcess]
  );

  return {
    filter,
    pagination,
    filtered,
    paginated,
    sorting,
    setSorting
  } as const;
};

export default useList;
