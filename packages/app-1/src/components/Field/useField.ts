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
  autoCompleteItems,
  filterByValue = true
}: FieldHookParams): FieldHookResults => {
  const [isEditing, setIsEditing] = useState(false);
  const [v, setV] = useState<typeof value>(value ?? '');
  // ref for clicking outside
  const fieldRef = useRef<HTMLDivElement>(null);
  const {
    setInnerValue,
    onChange,
    onAutoCompleteItemClicked,
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
    const setInnerValue: FieldHookResults['setInnerValue'] = (tmp) => {
      if (v !== tmp) {
        setV(tmp);
        isFunction(externalOnChange) && externalOnChange(tmp);
      }
    };
    const onChange: FieldHookResults['onChange'] = (e) => {
      const tmp = e.currentTarget?.value;
      // console.log('onChange', v);
      setInnerValue(tmp);
    };
    const onAutoCompleteItemClicked: FieldHookResults['onAutoCompleteItemClicked'] = (e) => {
      const tmp = e.currentTarget?.dataset?.value;
      if (!isUndefined(tmp)) {
        if (saveOnBlur) {
          setValue(e);
        } else {
          setInnerValue(tmp);
        }
      }
    };
    const setValue: FieldHookResults['setValue'] = (e) => {
      const tmp = e?.currentTarget?.dataset?.value ?? getFieldInput()?.value;
      // console.log('setValue', value, v, tmp);
      if (!isUndefined(tmp)) {
        const finalValue = isFunction(set) ? set(tmp) ?? tmp : tmp;
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
        if (!saveOnBlur) {
          setInnerValue(value);
        }
        disableEditMode();
      }
      if (e.key === 'Tab') {
        disableEditMode();
      }
    };
    return {
      setInnerValue,
      onChange,
      onAutoCompleteItemClicked,
      setValue,
      onKeyUp,
      onFocus: () => {
        // console.log('onFocus');
      },
      onBlur: () => {
        // console.log('onBlur', getFieldInput()?.value, innerValue, value);
        // workaround for autocompletion + saving on blur - skip saving, see clickOutside logic
        if (saveOnBlur) {
          if (!autoCompleteItems) {
            setValue();
          }
        }
      },
      disableEditMode,
      enableEditMode,
      getFieldInput
    };
  }, [isEditing, v, externalOnChange, saveOnBlur, set, value, autoCompleteItems]);
  // if clicking outside the , set flag to hide unless with autocompletion, then save first
  useClickOutside(fieldRef, () => {
    if (isEditing) {
      if (saveOnBlur) {
        if (autoCompleteItems) {
          setValue();
        }
      } else {
        setInnerValue(value);
      }
      disableEditMode();
    }
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

  const filteredAutoCompleteItems = useMemo(
    () =>
      autoCompleteItems?.filter((x) =>
        filterByValue
          ? x?.value?.toLocaleLowerCase()?.includes(String(v).toLocaleLowerCase())
          : true
      ),
    [autoCompleteItems, filterByValue, v]
  );

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
    onAutoCompleteItemClicked,
    onKeyUp,
    onBlur,
    onFocus,
    readOnlyProps,
    filteredAutoCompleteItems
  } as const;
};

export default useField;
