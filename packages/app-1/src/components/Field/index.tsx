import styled from '@emotion/styled';
import cx from 'classnames';
import { isFunction } from 'lodash-es';
import { Fragment } from 'react';

// import { timeout } from '@/utils';

import { FieldProps } from './typings';
import useField from './useField';

const StyledButton = styled.button``;

const Field = (props: FieldProps) => {
  const {
    fieldRef,
    v,
    onClickSetInnerValue,
    onChange,
    setValue,
    isEditing,
    onKeyUp,
    onBlur,
    onFocus,
    readOnlyProps
  } = useField(props);
  const {
    value: _value,
    scale: _scale,
    saveOnBlur,
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
    autoCompleteItems = [],
    ...rest
  } = props;

  return (
    <div
      className={cx('relative children:(my-auto)', 'w-full', 'relative z-1', className)}
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
          'h-6 w-full',
          'border border-transparent',
          '@hover:(border-primary)',
          'card-primary',
          !readOnly && inputClassName,
          !readOnly && !isEditing && 'cursor-pointer',
          readOnly && readOnlyClassName
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
            isEditing && 'btn btn-primary btn-compact cursor-pointer @hover:animate-pulse z-1',
            'inline-block absolute top-0 right-0',
            'items-center',
            'h-6 w-6 lh-0',
            iconClassName
          )}
          title="Click to confirm changes, or press Enter"
        >
          ✓
        </StyledButton>
      )}
      {isEditing && (
        <Fragment>
          {Array.isArray(autoCompleteItems) && autoCompleteItems.length > 0 && (
            <section
              className={cx(
                'absolute z-10 p-0 m-0 w-full max-h-40 overflow-y-auto',
                'card-primary',
                'children:(w-full inline-block border-b-1 border-primary)'
              )}
            >
              {autoCompleteItems.map(({ name, value }) => {
                const splits = name.split(new RegExp(`(${v})`, 'gi'));
                return (
                  <button
                    key={name}
                    className="anchor hover:bg-primary-hover"
                    data-value={value}
                    onClick={saveOnBlur ? setValue : onClickSetInnerValue}
                    onKeyUp={onKeyUp}
                  >
                    {splits.map((x, i) =>
                      x.toLocaleLowerCase() === String(v).toLocaleLowerCase() ? (
                        <span className="bg-warning" key={i}>
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
        </Fragment>
      )}
    </div>
  );
};

export default Field;
