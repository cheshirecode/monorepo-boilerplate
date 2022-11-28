import cx from 'classnames';
import type { MouseEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

export type PaginationProps = BaseProps & {
  itemsPerPage: number;
  /**
   *  how many items in the list
   */
  count: number;
  /**
   * first page to select, or can be used to subsequently change page
   */
  initialPage?: number;
  /**
   *  index 1 for display,  first page to select, or can be used to subsequently change page
   */
  page: number;
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
  total: number;
  /**
   * helper array with 1..total
   */
  pageNumbers: number;
  itemClassName?: string;
  activeItemClassName?: string;
  disabledItemClassName?: string;
  /**
   * default - true. clicking next/prev will go over the range.
   */
  isRollover?: boolean;
  /**
   * default - true. displays nothing if there's only 1 page.
   */
  isHiddenIfOnePage?: boolean;
  /**
   *
   * @param e
   * @param params
   * @returns
   */
  onChange?: (e: MouseEvent<HTMLButtonElement>, params: PaginationProps) => void;
};

export const createNewParams = ({ page, count, itemsPerPage }: PaginationProps) => {
  if (itemsPerPage !== ~~itemsPerPage || count !== ~~count || itemsPerPage <= 0 || count < 0) {
    // eslint-disable-next-line no-console
    console.error('itemsPerPage', itemsPerPage, 'count', count);
    throw RangeError('invalid props, both itemsPerPage and count need to be integers');
  }
  const total = Math.max(Math.ceil(count / itemsPerPage), 1);
  const newPage = Math.max(Math.min(page, total), 1);
  const first = Math.min((newPage - 1) * itemsPerPage, count);
  const last = Math.max(Math.min(count, first + itemsPerPage) - 1, total ? 1 : 0);
  return {
    page: newPage,
    last,
    first,
    total,
    pageNumbers: Array(total)
      .fill(0)
      .map((_v, i) => i + 1)
  };
};

export const DEFAULT_PROPS: PaginationProps = {
  count: 0,
  itemsPerPage: 1
};

export const usePagination = (props: PaginationProps) => {
  const { itemsPerPage, count, onChange, initialPage = 1 } = props ?? {};
  if (itemsPerPage !== ~~itemsPerPage || count !== ~~count || itemsPerPage <= 0 || count < 0) {
    // eslint-disable-next-line no-console
    console.error('itemsPerPage', itemsPerPage, 'count', count);
    throw RangeError('invalid props, both itemsPerPage and count need to be integers');
  }

  const [params, setParams] = useState(
    createNewParams({
      page: initialPage,
      count,
      itemsPerPage
    })
  );
  const updateParams = useCallback(
    (e: MouseEvent<HTMLButtonElement>, page: number) => {
      const params = createNewParams({
        page,
        count,
        itemsPerPage
      });
      setParams(params);
      if (typeof onChange === 'function') {
        onChange(e, params);
      }
    },
    [count, itemsPerPage, onChange]
  );

  useEffect(() => {
    updateParams(null, initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage, count, itemsPerPage]);

  const onPageNumberClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => updateParams(e, Number(e.currentTarget.dataset.id)),
    [updateParams]
  );

  const onPrevClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) =>
      updateParams(e, params.page <= 1 ? params.total : params.page - 1),
    [params.page, params.total, updateParams]
  );

  const onNextClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) =>
      updateParams(e, params.page >= params.total ? 1 : params.page + 1),
    [params.page, params.total, updateParams]
  );

  return {
    params,
    setParams,
    onPageNumberClick,
    onPrevClick,
    onNextClick
  } as const;
};

const Pagination = ({
  className,
  itemClassName,
  activeItemClassName,
  children: _children,
  itemsPerPage,
  count,
  onChange,
  isRollover = true,
  disabledItemClassName,
  initialPage,
  pageNumbers: _pageNumbers,
  isHiddenIfOnePage = true,
  ...props
}: PaginationProps) => {
  const {
    params: { page, pageNumbers, total },
    setParams: _setParams,
    onPageNumberClick,
    onPrevClick,
    onNextClick
  } = usePagination({
    ...props,
    initialPage,
    itemsPerPage,
    count,
    onChange
  });
  if (isHiddenIfOnePage && total <= 1) {
    return null;
  }

  return (
    <div className={cx('', className)} {...props}>
      <button
        key="prev"
        tabIndex={0}
        onClick={onPrevClick}
        className={cx('', !isRollover && page === 1 && disabledItemClassName, itemClassName)}
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
        onClick={onNextClick}
        className={cx('', !isRollover && page === total && disabledItemClassName, itemClassName)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
