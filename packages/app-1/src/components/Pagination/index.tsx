import cx from 'classnames';
import { useCallback, useState } from 'react';
import type { FC, MouseEvent } from 'react';

export type PaginationProps = BaseProps & {
  itemsPerPage: number;
  count: number;
  itemClassName?: string;
  activeItemClassName?: string;
  disabledItemClassName?: string;
  isRollover?: boolean;
  onChange?: (
    e: MouseEvent<HTMLButtonElement>,
    params: {
      page: number;
      last: number;
      first: number;
    }
  ) => void;
};

export const usePagination = (
  props: Pick<PaginationProps, 'itemsPerPage' | 'count' | 'onChange'>
) => {
  const { itemsPerPage, count, onChange } = props ?? {};
  if (itemsPerPage !== ~~itemsPerPage || count !== ~~count) {
    throw TypeError('invalid props, both itemsPerPage and count need to be provided as numbers');
  }
  const [params, setParams] = useState({
    page: 1,
    first: 0,
    last: itemsPerPage
  });

  const total = Math.ceil(count / itemsPerPage);
  // page numbers
  const pageNumbers = Array(total)
    .fill(0)
    .map((_v, i) => i + 1);

  const updateParams = useCallback(
    (e: MouseEvent<HTMLButtonElement>, page: number) => {
      const last = page * itemsPerPage;
      const first = last - itemsPerPage;
      const params = { page, first, last };
      setParams(params);
      if (typeof onChange === 'function') {
        onChange(e, params);
      }
    },
    [itemsPerPage, onChange]
  );

  const onPageNumberClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => updateParams(e, Number(e.currentTarget.dataset.id)),
    [updateParams]
  );

  const onPrevClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) =>
      updateParams(e, params.page <= 1 ? total : params.page - 1),
    [params.page, total, updateParams]
  );

  const onNextClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) =>
      updateParams(e, params.page >= total ? 1 : params.page + 1),
    [params.page, total, updateParams]
  );

  return {
    params,
    setParams,
    pageNumbers,
    total,
    onPageNumberClick,
    onPrevClick,
    onNextClick
  } as const;
};

const Pagination: FC<PaginationProps> = ({
  className,
  itemClassName,
  activeItemClassName,
  children: _children,
  itemsPerPage,
  count,
  onChange,
  isRollover = true,
  disabledItemClassName,
  ...props
}) => {
  const {
    params: { page },
    setParams: _setParams,
    pageNumbers,
    total,
    onPageNumberClick,
    onPrevClick,
    onNextClick
  } = usePagination({
    ...props,
    itemsPerPage,
    count,
    onChange
  });

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
