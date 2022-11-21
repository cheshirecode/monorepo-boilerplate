import { useMemo } from 'react';
import type { FC, ChangeEvent, MouseEvent /* , KeyboardEvent */ } from 'react';
import cx from 'classnames';
import { noop, isUndefined, isFunction, throttle } from 'lodash-es';

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
  // const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
  //   const v = e.currentTarget?.value;
  //   if (!isUndefined(v) && e.key === 'Enter' && isFunction(submit)) {
  //     submit(v);
  //   }
  // };
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
        className?.includes('w-') || 'w-full',
        className
      )}
      {...props}
    >
      <input
        type="search"
        className={cx(
          'search-bar-field',
          'w-0 flex-1',
          'rounded-none rounded-l-lg',
          !(searchButtonText?.length > 0) && 'rounded-r-lg',
          'px-4 py-2.5',
          'focus-visible:outline-none'
        )}
        placeholder={placeholder}
        aria-label="Search"
        aria-describedby="--poc-button-search"
        onChange={onChange}
        // onKeyUp={onEnter}
        value={value}
      />
      {searchButtonText?.length > 0 && (
        <button
          className="btn search-bar-field border-l-0 rounded-l-none border-1 m-0"
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
