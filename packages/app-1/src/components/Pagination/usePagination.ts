import { useCallback, useEffect, useMemo, useState } from 'react';

import { getIntervals } from '@/utils';

import type { PaginationHookResults, PaginationInputs, PaginationParams } from './typings';

export const DEFAULT_PAGINATION_THRESHOLD = 10;
const createNewParams: (
  p: PaginationInputs
) => PaginationParams & Required<Pick<PaginationInputs, 'page'>> = ({
  page,
  count,
  pageSize = DEFAULT_PAGINATION_THRESHOLD,
  _pageSize
}) => {
  if (count < 0) {
    // eslint-disable-next-line no-console
    console.error('pageSize', pageSize, 'count', count);
    throw RangeError('invalid props, both pageSize and count need to be integers');
  }

  /**
   * pageSize is +ve integer, use it
   * pageSize === false - use the full list
   * pageSize !== false and not +ve integer, take the 1st page size option
   * */
  const threshold = Math.max(count, DEFAULT_PAGINATION_THRESHOLD);
  const intervals = getIntervals(
    getIntervals([], threshold).concat(Number(pageSize), Number(_pageSize)),
    threshold
  );
  intervals.sort((a, b) => a - b);
  const n = (
    pageSize === false || pageSize === Math.abs(~~pageSize) ? [~~pageSize || threshold] : intervals
  )[0];
  // compute page size options for easy references
  const pageSizes =
    pageSize === Math.abs(~~pageSize)
      ? [...new Set(intervals.concat(n, Number(_pageSize)).filter((x) => !!x))]
      : intervals;
  pageSizes.sort((a, b) => a - b);

  const maxPage = Math.max(Math.ceil(count / n), 1);
  const newPage = Math.max(Math.min(Number(page), maxPage), 1);
  const first = Math.min((newPage - 1) * n, count);
  const last = Math.max(Math.min(count, first + n) - 1, maxPage ? 1 : 0);

  return {
    page: newPage,
    count,
    last,
    first,
    maxPage,
    pageNumbers: Array(maxPage)
      .fill(0)
      .map((_v, i) => i + 1),
    pageSize: n,
    pageSizes
  } as const;
};

const usePagination: (p: PaginationInputs) => PaginationHookResults = (props) => {
  const { page: initialPage = 1, pageSize, count, onChange, isRollover = true } = props ?? {};
  const [params, _setParams] = useState(
    createNewParams({
      page: initialPage,
      count,
      pageSize,
      _pageSize: pageSize
    })
  );
  const setParams = useCallback<PaginationHookResults['setParams']>(
    (params) => {
      _setParams((p) => {
        const newParams = createNewParams({
          ...p,
          ...params,
          _pageSize: pageSize
        });
        if (typeof onChange === 'function') {
          onChange(newParams);
        }
        return newParams;
      });
    },
    [onChange, pageSize]
  );

  const helpers: PaginationHookResults = useMemo(
    () => ({
      ...params,
      setParams,
      isNextPossible: isRollover || params.page > 1,
      isPrevPossible: isRollover || params.page < params.maxPage,
      isRollover,
      goTo: (page: number) => {
        setParams({ page });
      },
      onPageNumberClick: (e) => setParams({ page: Number(e.currentTarget.dataset.id) }),
      goPrevious: () => {
        setParams({ page: params.page <= 1 ? params.maxPage : params.page - 1 });
      },
      goNext: () => {
        setParams({ page: params.page >= params.maxPage ? 1 : params.page + 1 });
      },
      setPageSize: (pageSize: number) => setParams({ pageSize })
    }),
    [params, setParams, isRollover]
  );

  useEffect(() => {
    helpers.goTo(initialPage);
    setParams({
      page: initialPage,
      count,
      pageSize
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage, count, pageSize]);

  return helpers;
};

export default usePagination;
