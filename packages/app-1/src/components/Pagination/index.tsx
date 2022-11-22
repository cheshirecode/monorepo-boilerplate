import cx from 'classnames';
import { useCallback, useState } from 'react';
import type { FC, KeyboardEvent, MouseEvent } from 'react';

type EitherMouseOrKeyboardEvent<T> = MouseEvent<T> | KeyboardEvent<T>;

export type PaginationProps = BaseProps & {
  itemsPerPage: number;
  count: number;
  itemClassName?: string;
  activeItemClassName?: string;
  disabledItemClassName?: string;
  isRollover?: boolean;
  onChange?: (
    e: EitherMouseOrKeyboardEvent<HTMLLIElement>,
    params: {
      page: number;
      last: number;
      first: number;
    }
  ) => void;
};

const isUpdateEvent = (e: EitherMouseOrKeyboardEvent<HTMLLIElement>) => {
  const key = (e as KeyboardEvent<HTMLLIElement>)?.key;
  return !key || key === 'Enter';
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
    (e: EitherMouseOrKeyboardEvent<HTMLLIElement>, page: number) => {
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
    (e: EitherMouseOrKeyboardEvent<HTMLLIElement>) => {
      if (isUpdateEvent(e)) {
        updateParams(e, Number(e.currentTarget.dataset.id));
      }
    },
    [updateParams]
  );

  const onPrevClick = useCallback(
    (e: EitherMouseOrKeyboardEvent<HTMLLIElement>) => {
      if (isUpdateEvent(e)) {
        updateParams(e, params.page <= 1 ? total : params.page - 1);
      }
    },
    [params.page, total, updateParams]
  );

  const onNextClick = useCallback(
    (e: EitherMouseOrKeyboardEvent<HTMLLIElement>) => {
      if (isUpdateEvent(e)) {
        updateParams(e, params.page >= total ? 1 : params.page + 1);
      }
    },
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
    <ul className={cx('', className)} {...props}>
      <li
        key="prev"
        role="button"
        tabIndex="0"
        onClick={onPrevClick}
        onKeyUp={onPrevClick}
        className={cx('', !isRollover && page === 1 && disabledItemClassName, itemClassName)}
      >
        Prev
      </li>
      {pageNumbers.map((v) => (
        <li
          key={v}
          role="button"
          tabIndex="0"
          data-id={v}
          onClick={onPageNumberClick}
          onKeyUp={onPageNumberClick}
          className={cx('', v === page && activeItemClassName, itemClassName)}
        >
          {v}
        </li>
      ))}
      <li
        key="next"
        role="button"
        tabIndex="0"
        onClick={onNextClick}
        onKeyUp={onNextClick}
        className={cx('', !isRollover && page === total && disabledItemClassName, itemClassName)}
      >
        Next
      </li>
    </ul>
  );
};

export default Pagination;
