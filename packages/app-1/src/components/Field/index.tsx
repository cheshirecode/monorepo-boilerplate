import cx from 'classnames';
import { isUndefined, throttle } from 'lodash-es';
import type { ChangeEvent, KeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Icon from '@/components/Icon';
import useClickOutside from '@/services/hooks/useClickOutside';

export type FieldProps = BaseProps & {
  value: string | number;
  set: (v: FieldProps['value']) => void | FieldProps['value'];
  displayValue?: (v: FieldProps['value']) => FieldProps['value'];
  inputClassName?: string;
  readOnlyClassName?: string;
  iconClassName?: string;
  name: string;
  title?: string;
  readonly?: boolean;
};

const Field = ({
  className,
  value,
  displayValue,
  set,
  inputClassName,
  iconClassName,
  name,
  title,
  readonly,
  readOnlyClassName,
  ...props
}: FieldProps): ReactElement | null => {
  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState<FieldProps['value']>(value ?? '');
  const updateValue = useMemo(
    () =>
      throttle(
        (e: ChangeEvent<HTMLInputElement>) => {
          const v = e.currentTarget?.value;
          setInnerValue(v);
        },
        50,
        {
          trailing: true,
          leading: true
        }
      ),
    []
  );
  const setValue = useCallback(() => {
    const finalValue = set(innerValue);
    if (typeof finalValue !== 'undefined' && innerValue !== finalValue) {
      setInnerValue(finalValue);
    }
    setIsEditing(false);
  }, [innerValue, set]);

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const v = e.currentTarget?.value;
      if (!isUndefined(v) && e.key === 'Enter') {
        setValue();
      }
    },
    [setValue]
  );

  // ref for clicking outside
  const fieldRef = useRef<HTMLDivElement>(null);

  // if clicking outside the , set flag to hide
  useClickOutside(fieldRef, () => setIsEditing(false));
  // when editing, focus on input
  useEffect(() => {
    if (isEditing) {
      fieldRef.current?.querySelector('input')?.focus();
    }
  }, [isEditing]);
  // update state if passed in props change
  useEffect(() => {
    if (value !== innerValue) setInnerValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <>
      {!isEditing ? (
        <div
          className={cx(
            'w-full',
            'relative inline-flex flex-wrap items-center',
            'py-0 px-2',
            'border-1 border-transparent border-solid',
            !readonly && 'cursor-pointer @hover:(border-gray-30)',
            className,
            readonly && readOnlyClassName
          )}
          {...(readonly
            ? {}
            : { onClick: () => setIsEditing(true), title: title ?? 'Click to edit this field' })}
          {...props}
        >
          {displayValue ? displayValue(value) : value}
          <span
            // name="confirm"
            className={cx(
              'inline-block',
              'absolute top-0 right-2',
              'h-6 w-6',
              'disabled',
              iconClassName
            )}
          />
          {/* <input className={cx('block h-0 w-full')} /> */}
        </div>
      ) : null}
      {isEditing ? (
        <div className={cx('relative children:(my-auto)', 'w-full', className)} ref={fieldRef}>
          <input
            id={`--poc-field-${name}`}
            className={cx(
              'py-0 pl-2 pr-8',
              'border-1 border-transparent border-solid',
              '@hover:(border-gray-30)',
              inputClassName
            )}
            type="text"
            value={innerValue}
            placeholder={title}
            onChange={updateValue}
            onKeyUp={onEnter}
          />
          <Icon
            name="confirm"
            className={cx(
              'absolute top-0 right-2',
              'fill-gray-30',
              'h-6 w-6',
              'cursor-pointer @hover:animate-pulse',
              iconClassName
            )}
            onClick={setValue}
            title="Click to confirm changes, or press Enter"
          />
        </div>
      ) : null}
    </>
  );
};

export default Field;
