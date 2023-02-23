import { useCallback, useEffect, useMemo, useState } from 'react';

import { getIntervals } from '@/utils';

import type { PaginationHookParams, PaginationHookResults, PaginationParams } from './typings';

export const DEFAULT_PAGINATION_THRESHOLD = 10;
export const DEFAULT_PAGE_SIZE_COUNTS = 4;

/**
 * main logic to generate pagination parameters with clamped internvals and resolved page values
 *
 * @param param0
 * @returns
 */
const createNewParams: (
  p: PaginationHookParams
) => PaginationParams & Required<Pick<PaginationHookParams, 'page'>> = ({
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
    threshold,
    DEFAULT_PAGE_SIZE_COUNTS
  );
  let n = (
    pageSize === false || pageSize === Math.abs(~~pageSize) ? [~~pageSize || threshold] : intervals
  )[0];
  n = Math.max(n, intervals[0]);
  // compute page size options for easy references
  const pageSizes =
    pageSize === Math.abs(~~pageSize)
      ? getIntervals(
          [...new Set(intervals.concat(n, Number(_pageSize)).filter((x) => !!x))],
          threshold,
          DEFAULT_PAGE_SIZE_COUNTS
        )
      : intervals;

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

const usePagination: (p: PaginationHookParams) => PaginationHookResults = (props) => {
  const { page: initialPage = 1, pageSize, count, onChange, isRollover = false } = props ?? {};
  const [innerParams, setInnerParams] = useState(
    createNewParams({
      page: initialPage,
      count,
      pageSize,
      _pageSize: pageSize
    })
  );
  const setParams = useCallback<PaginationHookResults['setParams']>(
    (params: typeof innerParams) => {
      // need to re-create new params based on inputs thus onChange needs to be called inside
      setInnerParams((p) => {
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

  const helpers: PaginationHookResults = useMemo(() => {
    const goTo = (page: number) => {
      setParams({ page });
    };
    const { page, maxPage, pageNumbers, pageSizes } = innerParams;

    return {
      ...innerParams,
      setParams,
      isNextPossible: isRollover || page < maxPage,
      isPrevPossible: isRollover || page > 1,
      isRollover,
      isTotalLessThanMinPageSize: count < pageSizes[0],
      onPageNumberClick: (e) => setParams({ page: Number(e.currentTarget.dataset.id) }),
      goTo,
      goToAttempt: (v: unknown) => {
        const newV = pageNumbers.find((x) => x === Number(v)) ?? pageNumbers[0];
        goTo(newV);
        return newV;
      },
      goPrevious: () => {
        setParams({ page: page <= 1 ? maxPage : page - 1 });
      },
      goNext: () => {
        setParams({ page: page >= maxPage ? 1 : page + 1 });
      },
      goFirst: () => goTo(1),
      goLast: () => goTo(maxPage),
      setPageSize: (pageSize: number) => setParams({ pageSize: Number(pageSize) })
    };
  }, [innerParams, setParams, isRollover, count]);

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
