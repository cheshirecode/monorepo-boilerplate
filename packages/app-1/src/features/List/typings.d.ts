import type { PaginationInputs, PaginationStyleProps } from '@/components/Pagination/typings';
import type { TableProps } from '@/components/Table/typings';

export type ListParams<T> = {
  filter: {
    str: string;
    onChange?: (str: string) => void;
    fn?: (arr: T[], str: string) => T[];
  };
  pagination: Partial<PaginationInputs>;
};

export type ListProps<T> = BaseProps & {
  pagination: PaginationStyleProps & ListParams['pagination'];
  data: T[];
} & {
  table: Omit<TableProps<T>, 'data'>;
};
