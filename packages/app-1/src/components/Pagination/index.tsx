import cx from 'classnames';

import Field from '@/components/Field';

import type { PaginationProps } from './typings';
import usePagination from './usePagination';

export const PlainPagination = ({
  // skip those from internal hook
  children: _children,
  onChange: _onChange,
  setParams: _setParams,
  setPageSize,
  pageSize,
  pageSizes,
  first: _f,
  last: _l,
  count: _c,
  // necessary props
  className,
  itemClassName,
  activeItemClassName,
  disabledItemClassName,
  page,
  pageNumbers,
  maxPage,
  onPageNumberClick,
  isRollover,
  isPrevPossible,
  goPrevious,
  isNextPossible,
  goTo: _g,
  goNext,
  goFirst,
  goLast,
  goToAttempt,
  showAllPages = false,
  isTotalLessThanMinPageSize,
  // DOM-only props
  ...props
}: PaginationProps) => {
  return (
    !isTotalLessThanMinPageSize && (
      <section className="flex my-4 min-h-10">
        {maxPage > 1 && (
          <div
            className={cx(
              'flex-1 flex flex-gap-2 justify-center',
              'w-fit mx-auto',
              'children:(p-2 cursor-pointer transition-all-200)',
              className
            )}
            {...props}
          >
            <button
              key="first"
              tabIndex={0}
              onClick={goFirst}
              disabled={!isPrevPossible && !isRollover}
              className={cx(
                'btn btn-secondary',
                !isPrevPossible && !isRollover && cx('disabled opacity-30', disabledItemClassName),
                itemClassName
              )}
            >
              {'<<'}
            </button>
            <button
              key="prev"
              tabIndex={0}
              onClick={goPrevious}
              disabled={!isPrevPossible && !isRollover}
              className={cx(
                'btn btn-secondary',
                !isPrevPossible && !isRollover && cx('disabled opacity-30', disabledItemClassName),
                itemClassName
              )}
            >
              {'<'}
            </button>
            {!showAllPages && (
              <Field
                name="--pagination-page"
                value={String(page)}
                title="Click to change page"
                displayValue={(v) => `${v} / ${maxPage}`}
                set={goToAttempt}
                className={cx(
                  'uno-layer-o:(h-full py-0 hover-none inline-block)',
                  'uno-layer-o:(my-auto w-fit)'
                )}
                inputClassName="uno-layer-o:w-10ch"
                readOnly={maxPage <= 1}
              />
            )}
            {showAllPages &&
              pageNumbers.map((v) => (
                <button
                  key={v}
                  tabIndex={0}
                  data-id={v}
                  onClick={onPageNumberClick}
                  disabled={v === page}
                  className={cx(
                    'btn btn-secondary',
                    v === page && cx('bg-secondary disabled', activeItemClassName),
                    itemClassName
                  )}
                >
                  {v}
                </button>
              ))}
            <button
              key="next"
              tabIndex={0}
              onClick={goNext}
              disabled={!isNextPossible && !isRollover}
              className={cx(
                'btn btn-secondary',
                !isNextPossible && !isRollover && cx('disabled opacity-30', disabledItemClassName),
                itemClassName
              )}
            >
              {'>'}
            </button>
            <button
              key="last"
              tabIndex={0}
              onClick={goLast}
              disabled={!isNextPossible && !isRollover}
              className={cx(
                'btn btn-secondary',
                !isNextPossible && !isRollover && cx('disabled opacity-30', disabledItemClassName),
                itemClassName
              )}
            >
              {'>>'}
            </button>
          </div>
        )}
        <div className="my-auto ml-auto h-full">
          Page size
          <select
            className="ml-2 h-inherit card-secondary"
            onChange={(e) => setPageSize(e.currentTarget.value)}
            value={pageSize}
          >
            {pageSizes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </section>
    )
  );
};

const Pagination = (props: PaginationProps) => {
  const extraProps = usePagination(props);

  return <PlainPagination {...props} {...extraProps} />;
};

export default Pagination;
