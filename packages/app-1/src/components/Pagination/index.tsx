import cx from 'classnames';

import type { PaginationProps } from './typings';
import usePagination from './usePagination';

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
