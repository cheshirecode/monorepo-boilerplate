import type { RefObject } from 'react';

export type FieldHookParams = {
  value: string | number;
  onChange?: (v?: FieldProps['value']) => void | FieldProps['value'];
  set?: (v?: FieldProps['value']) => void | FieldProps['value'];
  title?: string;
  readOnly?: boolean;
  /**
   * default - 1
   */
  scale?: number;
  saveOnBlur?: boolean;
};

export type FieldHookResults = {
  readonly fieldRef: RefObject<HTMLDivElement>;
  readonly getFieldInput: () => HTMLElement | null | undefined;
  readonly innerValue: FieldHookParams['value'];
  readonly onChange: (e: ChangeEvent<HTMLElement>) => void;
  readonly setValue: () => void;
  readonly isEditing: boolean;
  readonly onEnter: (e: KeyboardEvent<HTMLElement>) => void;
  readonly onBlur: () => void;
  readonly style: {
    transform: string;
  };
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
