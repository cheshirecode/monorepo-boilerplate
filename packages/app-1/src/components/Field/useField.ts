import { isFunction, isUndefined } from 'lodash-es';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';

import useClickOutside from '@/services/hooks/useClickOutside';

import { FieldHookParams, FieldHookResults } from './typings';

const useField = ({
  value,
  set,
  onChange: externalOnChange,
  title,
  readOnly,
  scale = 1,
  saveOnBlur = false
}: FieldHookParams): FieldHookResults => {
  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState<typeof value>(value ?? '');
  const deferredValue = useDeferredValue(innerValue);
  // ref for clicking outside
  const fieldRef = useRef<HTMLDivElement>(null);
  const { onChange, setValue, onEnter, onBlur, getFieldInput, disableEditMode, enableEditMode } =
    useMemo(() => {
      const getFieldInput = () => fieldRef.current?.querySelector('input');
      const disableEditMode = () => {
        setIsEditing(false);
        getFieldInput()?.blur();
      };
      const enableEditMode = () => {
        setIsEditing(true);
        // when editing, focus on input
        getFieldInput()?.focus();
      };
      return {
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const v = e.currentTarget?.value;
          if (!isUndefined(v)) {
            setInnerValue(v);
            isFunction(externalOnChange) && externalOnChange(v);
          }
        },
        setValue: () => {
          const finalValue = isFunction(set) ? set(deferredValue) : deferredValue;
          if (!isUndefined(finalValue) && deferredValue !== finalValue) {
            setInnerValue(deferredValue);
          }
          disableEditMode();
        },
        onEnter: (e: KeyboardEvent<HTMLInputElement>) => {
          const v = e.currentTarget?.value;
          if (!isUndefined(v) && e.key === 'Enter') {
            setInnerValue(value);
            setValue();
          }
        },
        onBlur: () => {
          if (saveOnBlur) {
            setValue();
          } else {
            setInnerValue(value);
            disableEditMode();
          }
        },
        disableEditMode,
        enableEditMode,
        getFieldInput
      };
    }, [deferredValue, externalOnChange, saveOnBlur, set, value]);
  // if clicking outside the , set flag to hide
  useClickOutside(fieldRef, disableEditMode);

  // update state if passed in props change
  useEffect(() => {
    if (value !== innerValue) setInnerValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const style = {
    transform: `scale(${scale}) translate(${scale > 1 ? 24 * scale : 0}px, ${
      scale > 1 ? 24 * 0.125 * scale : 0
    }px)`
  };
  const readOnlyProps = isEditing
    ? {}
    : {
        readOnly,
        onClick: enableEditMode,
        onFocus: enableEditMode,
        title: title ?? 'Click to edit this field'
      };
  return {
    fieldRef,
    innerValue,
    isEditing,
    onChange,
    setValue,
    onEnter,
    onBlur,
    getFieldInput,
    style,
    readOnlyProps
  } as const;
};

export default useField;
