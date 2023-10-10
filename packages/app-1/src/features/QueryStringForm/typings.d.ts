import type { DetailsProps } from '@/components/Details/typings';
import type { FieldProps } from '@/components/Field/typings';

export type QueryStringHookParams = {
  queryString: string;
  onQsChange?: (str: string) => void;
  onKeyValueChange?: (k: string, v: unknown) => void;
  onParamsChange?: (kv: Record<string, unknown>) => void;
  persistState?: boolean;
};

export type QueryStringFormProps<T> = BaseProps &
  DetailsProps<T> &
  QueryStringHookParams & {
    fieldPropsByKey?: (k: string) => FieldProps;
    bigText?: boolean;
  };
