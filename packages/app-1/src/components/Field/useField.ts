import { isFunction, isUndefined } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';

import useClickOutside from '@/services/hooks/useClickOutside';

import { FieldHookParams, FieldHookResults } from './typings';

const useField = ({
  value,
  set,
  onChange: externalOnChange,
  title,
  readOnly,
  saveOnBlur = false,
  autoCompleteItems
}: FieldHookParams): FieldHookResults => {
  const [isEditing, setIsEditing] = useState(false);
  const [v, setV] = useState<typeof value>(value ?? '');
  // ref for clicking outside
  const fieldRef = useRef<HTMLDivElement>(null);
  const {
    setInnerValue,
    onChange,
    onClickSetInnerValue,
    setValue,
    onKeyUp,
    onFocus,
    onBlur,
    disableEditMode,
    enableEditMode,
    getFieldInput
  } = useMemo(() => {
    const getFieldInput = () => fieldRef.current?.querySelector('input');
    const disableEditMode = () => {
      isEditing && setIsEditing(false);
      getFieldInput()?.blur();
    };
    const enableEditMode = () => {
      !isEditing && setIsEditing(true);
      // when editing, focus on input
      fieldRef?.current?.focus();
      getFieldInput()?.focus();
    };
    const setInnerValue: FieldHookResults['setInnerValue'] = (value) => {
      if (v !== value) {
        setV(value);
        isFunction(externalOnChange) && externalOnChange(value);
      }
    };
    const onChange: FieldHookResults['onChange'] = (e) => {
      const v = e.currentTarget?.value;
      // console.log('onChange', v);
      setInnerValue(v);
    };
    const onClickSetInnerValue: FieldHookResults['onClickSetInnerValue'] = (e) => {
      const v = e.currentTarget?.dataset?.value;
      if (!isUndefined(v)) {
        setInnerValue(v);
      }
    };
    const setValue: FieldHookResults['setValue'] = (e) => {
      const v = e?.currentTarget?.dataset?.value ?? getFieldInput()?.value;
      if (!isUndefined(v)) {
        // console.log('setValue', v, innerValue);
        const finalValue = isFunction(set) ? set(v) ?? v : v;
        setInnerValue(finalValue);
        disableEditMode();
      }
    };
    const onKeyUp: FieldHookResults['onKeyUp'] = (e) => {
      // console.log('onKeyUp', getFieldInput()?.value, innerValue);
      if (e.key === 'Enter') {
        setValue();
      }
      if (e.key === 'Escape') {
        disableEditMode();
      }
    };
    return {
      setInnerValue,
      onChange,
      onClickSetInnerValue,
      setValue,
      onKeyUp,
      onFocus: () => {
        // console.log('onFocus');
      },
      onBlur: () => {
        // console.log('onBlur', getFieldInput()?.value, innerValue, value);
        // workaround for autocompletion + saving on blur - skip saving, see clickOutside logic
        if (saveOnBlur && !autoCompleteItems) {
          setValue();
        }
      },
      disableEditMode,
      enableEditMode,
      getFieldInput
    };
  }, [isEditing, v, externalOnChange, set, autoCompleteItems, saveOnBlur]);
  // if clicking outside the , set flag to hide unless with autocompletion, then save first
  useClickOutside(fieldRef, () => {
    if (saveOnBlur && autoCompleteItems) {
      setValue();
    }
    disableEditMode();
  });

  // update state if passed in props change
  useEffect(() => {
    // console.log('useEffect', value, innerValue);
    if (value !== v) {
      setInnerValue(value);
      isFunction(externalOnChange) && externalOnChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const readOnlyProps = isEditing
    ? {}
    : {
        readOnly,
        ...(readOnly
          ? {}
          : {
              onClick: enableEditMode,
              onFocus: enableEditMode,
              title: title ?? 'Click to edit this field'
            })
      };
  return {
    fieldRef,
    getFieldInput,
    v,
    isEditing,
    setInnerValue,
    setValue,
    onChange,
    onClickSetInnerValue,
    onKeyUp,
    onBlur,
    onFocus,
    readOnlyProps
  } as const;
};

export default useField;
