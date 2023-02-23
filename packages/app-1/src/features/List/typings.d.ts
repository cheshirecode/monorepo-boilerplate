import type { PaginationHookParams } from '@/components/Pagination/typings';

export type ListParams<T> = {
  filter: {
    str: string;
    onChange?: (str: string) => void;
    fn?: (arr: T[], str: string) => T[];
  };
  pagination: Partial<PaginationHookParams>;
  postProcess?: (arr: T[]) => T[];
};
