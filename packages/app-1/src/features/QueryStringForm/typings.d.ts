import type { DetailsProps } from '@/components/Details/typings';
import type { FieldProps } from '@/components/Field/typings';

export type QueryStringHookParams = {
  queryString: string;
  onChange: (str: string) => void;
  persistState?: boolean;
};
export type QueryStringHookResults = readonly {
  queryStr: string;
  setQueryStr: (v: string) => void;
  q: CURLSearchParams;
  searchParams: Record<string, string>;
  createSetter: (k: string) => (v: string | number) => void;
};

export type QueryStringFormProps = BaseProps &
  QueryStringHookParams & {
    metadata: DetailsProps['metadata'];
    fieldPropsByKey: (k: string) => FieldProps;
  };
