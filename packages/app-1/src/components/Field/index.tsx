import styled from '@emotion/styled';
import cx from 'classnames';
import { escapeRegExp, isFunction } from 'lodash-es';
import { Fragment } from 'react';

// import { timeout } from '@/utils';

import { FieldProps } from './typings';
import useField from './useField';

const StyledButton = styled.button``;

const Field = (props: FieldProps) => {
  const {
    fieldRef,
    v,
    onAutoCompleteItemClicked,
    onChange,
    setValue,
    isEditing,
    onKeyUp,
    onBlur,
    onFocus,
    readOnlyProps,
    filteredAutoCompleteItems
  } = useField(props);
  const {
    value: _value,
    saveOnBlur: _s,
    set: _set,
    onChange: _onChange,
    className,
    displayValue,
    inputClassName,
    iconClassName,
    name,
    title,
    readOnly,
    readOnlyClassName,
    noConfirmation = false,
    autoCompleteItems: _a,
    autoCompletePos = 'absolute',
    filterByValue: _f,
    ...rest
  } = props;

  return (
    <div
      className={cx('relative children:(my-auto)', 'w-full', isEditing && 'z-1', className)}
      ref={fieldRef}
      onFocus={onFocus}
      {...rest}
    >
      <input
        id={`--poc-field-${name}`}
        name={name}
        className={cx(
          'py-0 pl-2 ',
          noConfirmation ? 'pr-2' : 'pr-8',
          'min-h-6',
          'h-full w-full',
          'border border-transparent',
          '@hover:(border-primary)',
          !readOnly && inputClassName,
          !readOnly && 'card-secondary',
          !readOnly && !isEditing && 'cursor-pointer',
          readOnly && readOnlyClassName,
          readOnly && 'card-primary'
        )}
        type="text"
        value={isEditing ? v : isFunction(displayValue) ? displayValue(v) : v}
        placeholder={title}
        onChange={onChange}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        {...readOnlyProps}
      />
      {!readOnly && !noConfirmation && (
        <StyledButton
          onClick={setValue}
          className={cx(
            !isEditing && 'btn-transparent z--1',
            isEditing && 'btn-primary cursor-pointer @hover:animate-pulse z-2',
            'inline-block absolute right-0',
            'items-center',
            'h-full px-2 lh-0',
            iconClassName
          )}
          title="Click to confirm changes, or press Enter"
        >
          ✓
        </StyledButton>
      )}
      {isEditing && (
        <Fragment>
          {Array.isArray(filteredAutoCompleteItems) && filteredAutoCompleteItems.length > 0 && (
            <section
              className={cx(
                autoCompletePos === 'absolute' && 'absolute z-3',
                autoCompletePos === 'relative' && 'relative flex flex-col',
                'p-0 m-0 py-2 w-full max-h-40 overflow-y-auto',
                'card-primary border border-t-0 shadow-lg',
                'children:(w-full inline-block border-0)',
                'animate-duration-200 animate-fade-in'
              )}
            >
              {filteredAutoCompleteItems.map(({ name, value }) => {
                const splits = name.split(new RegExp(`(${escapeRegExp(v)})`, 'gi'));
                return (
                  <button
                    key={name}
                    className={cx(
                      'bg-inherit',
                      // value !== v ? 'cursor-pointer anchor hover:bg-primary-hover' : 'disabled'
                      'cursor-pointer anchor hover:bg-primary-hover'
                    )}
                    data-value={value}
                    onClick={onAutoCompleteItemClicked}
                    onKeyUp={onKeyUp}
                  >
                    {splits.map((x, i) =>
                      x.toLocaleLowerCase() === String(v).toLocaleLowerCase() ? (
                        <span className={cx('bg-warning')} key={i}>
                          {x}
                        </span>
                      ) : (
                        x
                      )
                    )}
                  </button>
                );
              })}
            </section>
          )}
          {Array.isArray(filteredAutoCompleteItems) && filteredAutoCompleteItems.length === 0 && (
            <section
              className={cx(
                autoCompletePos === 'absolute' && 'absolute z-3',
                autoCompletePos === 'relative' && 'relative flex flex-col',
                'p-0 m-0 py-2 w-full',
                'card-primary border border-t-0 shadow-lg'
              )}
            >
              No items...
            </section>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Field;
