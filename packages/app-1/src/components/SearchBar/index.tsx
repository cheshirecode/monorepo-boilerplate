import cx from 'classnames';
import { isFunction, isUndefined, noop, throttle } from 'lodash-es';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useMemo } from 'react';

const SearchBar: FC<
  BaseProps & {
    update?: (v: string) => void;
    submit?: (v: string) => void;
    placeholder?: string;
    searchButtonText?: string;
    value: string;
  }
> = ({
  className,
  value,
  placeholder = 'search placeholder',
  searchButtonText = 'Search',
  update = noop,
  submit = noop,
  ...props
}) => {
  const updateValue = useMemo(
    () =>
      throttle(
        (v) => {
          update(v);
        },
        50,
        {
          trailing: true,
          leading: true
        }
      ),
    [update]
  );

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isFunction(submit)) {
      submit(value);
    }
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget?.value;
    if (!isUndefined(v) && isFunction(update)) {
      updateValue(v);
    }
  };
  return (
    <form
      className={cx(
        'inline-flex justify-center sm:justify-end items-center children:h-full',
        'relative',
        'w-full',
        className
      )}
      {...props}
    >
      <input
        type="search"
        className={cx(
          'flex-1 h-inherit',
          'rounded-none rounded-l-lg',
          !(searchButtonText?.length > 0) && 'rounded-r-lg',
          'px-4 py-2',
          'border border-cta',
          'z-2',
          'focus-visible:outline-none'
        )}
        placeholder={placeholder}
        aria-label="Search"
        aria-describedby="--poc-button-search"
        onChange={onChange}
        value={value}
      />
      {searchButtonText?.length > 0 && (
        <button
          className={cx(
            'btn-cta border-cta-blend',
            'm-0 my--1',
            'uno-layer-o:(rounded-l-none border-l-0)',
            'z-1'
          )}
          id="--poc-button-search"
          onClick={onClick}
        >
          {searchButtonText}
        </button>
      )}
    </form>
  );
};

export default SearchBar;
