import cx from 'classnames';
import { isUndefined, throttle } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, ReactElement } from 'react';

import Icon from '@/components/Icon';
import useClickOutside from '@/services/hooks/useClickOutside';

export type FieldProps = BaseProps & {
  value?: string;
  set: (v: string) => void;
  iconClassName?: string;
  name?: string;
  title?: string;
  readonly?: boolean;
};

const Field = ({
  className,
  value,
  set,
  iconClassName,
  name,
  title,
  readonly,
  ...props
}: FieldProps): ReactElement | null => {
  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState(value ?? '');
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
    set(innerValue);
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
  });
  return (
    <>
      {!isEditing ? (
        <div
          className={cx(
            'w-full',
            'flex items-center',
            'py-0 px-2',
            'border-1 border-transparent border-solid',
            !readonly && 'cursor-pointer hover:(border-gray-30)',
            className
          )}
          {...(readonly
            ? {}
            : { onClick: () => setIsEditing(true), title: title ?? 'Click to edit this field' })}
          {...props}
        >
          {/* no line height since flexbox handles vertical centering (otherwise use line-height = full height) */}
          <span className="w-full pre-wrap">{value}</span>
        </div>
      ) : null}
      {isEditing ? (
        <div className={cx('relative w-full', className)} ref={fieldRef}>
          <input
            id={`--poc-field-${name}`}
            className={cx(
              'w-full',
              'py-0 pl-2',
              className?.includes('p-') ||
                className?.includes('pr-') ||
                className?.includes('px-') ||
                'pr-8',
              'border-1 border-transparent border-solid',
              'hover:(border-gray-30)',
              className
            )}
            type="text"
            value={innerValue}
            onChange={updateValue}
            onKeyUp={onEnter}
          />
          <Icon
            name="confirm"
            className={cx(
              'absolute top-0 right-2',
              'fill-gray-30',
              iconClassName?.includes('h-') || 'h-6',
              iconClassName?.includes('w-') || 'w-6',
              'cursor-pointer hover:animate-pulse',
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
