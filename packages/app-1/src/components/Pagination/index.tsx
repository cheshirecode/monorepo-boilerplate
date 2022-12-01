import cx from 'classnames';
import type { MouseEvent } from 'react';

import usePagination from './usePagination';

export type PaginationInputs = {
  /**
   *  how many items in the list
   */
  count: number;
  /**
   *  index 1 for display,  first page to select, or can be used to subsequently change page
   */
  page: number;
  /**
   * provide number of items per page based on other params or can be passed in to override
   */
  pageSize: number | boolean;
  /**
   * original page size
   */
  _pageSize?: number | boolean;
  /**
   *
   * change callback(PAGINATION_PARAMS) whenever pagination happens
   */
  onChange?: (params: Partial<PaginationInputs>) => void;
  /**
   * default - true. clicking next/prev will go over the range.
   */
  isRollover?: boolean;
};

export type PaginationParams = PaginationInputs & {
  /**
   *  index 0 for array's beginning index
   */
  last: number;
  /**
   *  index 0 for array's end index. remember to do Array.slice(first, last + 1) to include the last element
   */
  first: number;
  /**
   *  max page number
   */
  maxPage: number;
  /**
   * helper array with 1..maxPage
   */
  pageNumbers: number[];
  /**
   * page size options
   */
  pageSizes: number[];
  /**
   * setter for other params
   * @param params
   * @returns
   */
};

export type PaginationHookResults = PaginationParams & {
  /**
   *
   * change callback(PAGINATION_PARAMS) whenever pagination happens
   */
  onChange?: (params: Partial<PaginationInputs>) => void;
  /**
   * default - true. clicking next/prev will go over the range.
   */
  isRollover?: boolean;
  setParams: (params: Partial<PaginationInputs>) => void;
  /**
   * helper callback to render custom paginator
   */
  onPageNumberClick: (e: MouseEvent<HTMLElement>) => void;
  /**
   * go back
   */
  goPrevious: () => void;
  /**
   * go next
   */
  goNext: () => void;
  /**
   * go to page
   */
  goTo: (n: number) => void;
  /**
   * set how many items on a page
   */
  setPageSize: (n: number) => void;
  /**
   * indicate whether next page is possible
   */
  isNextPossible: boolean;
  /**
   * indicate whether prev page is possible
   */
  isPrevPossible: boolean;
};

export type PaginationProps = BaseProps &
  PaginationHookResults & {
    itemClassName?: string;
    activeItemClassName?: string;
    disabledItemClassName?: string;
  };

export const PlainPagination = ({
  // skip those from internal hook
  children: _children,
  pageSize: _pageSize,
  count: _count,
  onChange: _onChange,
  isRollover: _isRollover,
  goTo: _goTo,
  setParams: _setParams,
  setPageSize: _setPageSize,
  pageSizes: _pageSizes,
  // necessary props
  className,
  itemClassName,
  activeItemClassName,
  disabledItemClassName,
  page,
  pageNumbers,
  maxPage,
  onPageNumberClick,
  isPrevPossible,
  goPrevious,
  isNextPossible,
  goNext,
  // DOM-only props
  ...props
}: PaginationProps) => {
  if (maxPage <= 1) {
    return null;
  }

  return (
    <div className={cx('', className)} {...props}>
      <button
        key="prev"
        tabIndex={0}
        onClick={goPrevious}
        className={cx('', !isPrevPossible && disabledItemClassName, itemClassName)}
      >
        Prev
      </button>
      {pageNumbers.map((v) => (
        <button
          key={v}
          tabIndex={0}
          data-id={v}
          onClick={onPageNumberClick}
          className={cx('', v === page && activeItemClassName, itemClassName)}
        >
          {v}
        </button>
      ))}
      <button
        key="next"
        tabIndex={0}
        onClick={goNext}
        className={cx('', !isNextPossible && disabledItemClassName, itemClassName)}
      >
        Next
      </button>
    </div>
  );
};

const Pagination = (props: PaginationProps) => {
  const extraProps = usePagination(props);

  return <PlainPagination {...props} {...extraProps} />;
};

export default Pagination;
