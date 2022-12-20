import cx from 'classnames';
import { isFunction } from 'lodash-es';
import type { ReactElement } from 'react';

import { FieldProps } from './typings';
import useField from './useField';

const Field = (props: FieldProps): ReactElement | null => {
  const {
    fieldRef,
    innerValue,
    onChange,
    setValue,
    isEditing,
    onEnter,
    onBlur,
    style,
    readOnlyProps
  } = useField(props);
  const {
    value: _value,
    scale: _scale,
    saveOnBlur: _saveOnBlur,
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
    ...rest
  } = props;

  return (
    <div
      className={cx('relative children:(my-auto)', 'w-full', className)}
      ref={fieldRef}
      {...rest}
      style={style}
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
          !isEditing && 'cursor-pointer',
          'bg-primary color-primary',
          !readOnly && inputClassName,
          readOnly && readOnlyClassName
        )}
        type="text"
        value={
          isEditing ? innerValue : isFunction(displayValue) ? displayValue(innerValue) : innerValue
        }
        placeholder={title}
        onChange={onChange}
        onKeyUp={onEnter}
        onBlur={onBlur}
        {...readOnlyProps}
      />
      {!noConfirmation && (
        <button
          onClick={setValue}
          className={cx(
            !isEditing && 'disable invisible',
            'inline-block absolute top-0 right-0',
            'items-center',
            'btn btn-primary btn-compact h-6 w-6 lh-0',
            'cursor-pointer @hover:animate-pulse',
            iconClassName
          )}
          title="Click to confirm changes, or press Enter"
        >
          ✓
        </button>
      )}
    </div>
  );
};

export default Field;
