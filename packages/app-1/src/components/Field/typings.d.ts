import type { MouseEvent, RefObject } from 'react';

export type FieldHookParams = {
  value: string | number;
  onChange?: (v: FieldProps['value']) => void | FieldProps['value'];
  set?: (v: FieldProps['value']) => void | FieldProps['value'];
  title?: string;
  readOnly?: boolean;
  /**
   * default - 1
   */
  scale?: number;
  saveOnBlur?: boolean;
  /**
   * autocomplete list
   */
  autoCompleteItems?: {
    name: string;
    value: string;
  }[];
};

export type FieldHookResults = {
  readonly fieldRef: RefObject<HTMLDivElement>;
  readonly getFieldInput: () => HTMLElement | null | undefined;
  readonly v: FieldHookParams['value'];
  /**
   * intermediate (not yet final) value before confirmation (if saveOnBlue=false), will always trigger onChange
   * @param v
   * @returns
   */
  readonly setInnerValue: (v: FieldHookParams['value']) => void;
  /**
   * commit/set the value from either data-value or input value
   * @param e
   * @returns
   */
  readonly setValue: (e?: MouseEvent<HTMLElement>) => void;
  readonly onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly onClickSetInnerValue: (e: MouseEvent<HTMLElement>) => void;
  readonly isEditing: boolean;
  readonly onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  readonly onFocus: () => void;
  readonly onBlur: () => void;
  readonly readOnlyProps: {
    onClick?: () => void;
    onFocus?: () => void;
    title?: string;
  };
};
export type FieldProps = BaseProps &
  FieldHookParams & {
    displayValue?: (v: FieldProps['value']) => FieldProps['value'];
    inputClassName?: string;
    readOnlyClassName?: string;
    iconClassName?: string;
    noConfirmation?: boolean;
    name: string;
  };
