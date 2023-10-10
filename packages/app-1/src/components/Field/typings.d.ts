import type { KeyboardEvent, MouseEvent, RefObject } from 'react';

export type FieldHookParams = {
  value: string | number;
  onChange?: (v: FieldProps['value']) => void | FieldProps['value'];
  set?: (v: FieldProps['value']) => void | FieldProps['value'];
  title?: string;
  readOnly?: boolean;
  saveOnBlur?: boolean;
  noConfirmation?: boolean;
  /**
   * autocomplete list, pass non-array to skip
   */
  autoCompleteItems?: {
    name: string;
    value: string;
  }[];
  filterByValue?: boolean;
  edit?: boolean;
  idPrefix?: string;
  onBlur: (v?: unknown) => void;
};

export type FieldHookResults = {
  fieldRef: RefObject<HTMLDivElement>;
  getFieldInput: () => HTMLElement | null | undefined;
  v: FieldHookParams['value'];
  /**
   * intermediate (not yet final) value before confirmation (if saveOnBlue=false), will always trigger onChange
   * @param v
   * @returns
   */
  setInnerValue: (v: FieldHookParams['value']) => void;
  /**
   * commit/set the value from either data-value or input value
   * @param e
   * @returns
   */
  setValue: (e?: MouseEvent<HTMLElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * event handler for clicking on an autocomplete item, depending on saving mode (onBlur or otherwise)
   */
  onAutoCompleteItemClicked: (e: MouseEvent<HTMLElement>) => void;
  isEditing: boolean;
  onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;

  readOnlyProps: {
    onClick?: () => void;
    onFocus?: () => void;
    title?: string;
  };
  filteredAutoCompleteItems?: {
    name: string;
    value: string;
  }[];
  saveOnBlur: boolean;
  noConfirmation: boolean;
};
export type FieldProps = BaseProps &
  FieldHookParams & {
    name: string;
    displayValue?: (v: FieldProps['value']) => FieldProps['value'];
    inputClassName?: string;
    readOnlyClassName?: string;
    iconClassName?: string;
    autoCompletePos?: 'absolute' | 'relative';
    autoCompleteClassName?: string;
  };
