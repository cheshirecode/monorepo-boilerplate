import type { PaginationInputs, PaginationStyleProps } from '@/components/Pagination/typings';
import type { TableProps } from '@/components/Table/typings';

export type ListParams = {
  filter: {
    str: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn?: (arr: any[], str: string) => any[];
    onChange?: (str: string) => void;
  };
  pagination: Partial<PaginationInputs>;
};

export type ListProps<T extends Record<string, unknown>> = BaseProps & {
  pagination: PaginationStyleProps & ListParams['pagination'];
  data: T[];
} & {
  table: Omit<TableProps<T>, 'data'>;
};
