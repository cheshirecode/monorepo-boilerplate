import type { DetailsProps } from '@/components/Details/typings';
import type { FieldProps } from '@/components/Field/typings';

export type QueryStringHookParams = {
  queryString: string;
  onQsChange?: (str: string) => void;
  onKeyValueChange?: (k: string, v: unknown) => void;
  onParamsChange?: (kv: Record<string, unknown>) => void;
  persistState?: boolean;
};

export type QueryStringFormProps = BaseProps &
  DetailsProps &
  QueryStringHookParams & {
    fieldPropsByKey?: (k: string) => FieldProps;
    /**
     * default - false. flag to set out per line unless the viewport is really small
     */
    oneFieldPerLine?: boolean;
    bigText?: boolean;
  };
