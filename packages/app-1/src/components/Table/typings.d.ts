import type {
  Cell,
  CellContext,
  ColumnDef,
  ColumnHelper,
  Header,
  Row,
  TableOptions
} from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type InternalTableProps<T> = Partial<TableOptions<T>> & Pick<TableOptions<T>, 'data'>;

export type ExtraInternalTableProps<T> = {
  cellRenderer?: (props: CellContext<T, unknown>, v: string | null) => ReactNode;
  subRowRenderer?: (props: Row<T>) => ReactNode;
  createColumnDefs?: (colDefs: ColumnDef<T>[], helper: ColumnHelper<T>) => ColumnDef<T>[];
};

export type TableHookParams = Omit<
  TableOptions<T>,
  'columns' | 'state' | 'onSortingChange' | 'getCoreRowModel' | 'getSortedRowModel'
>;

export type TableProps<T> = BaseProps &
  InternalTableProps<T> & {
    extra?: ExtraInternalTableProps<T>;
    classNameGetters?: {
      header?: (props: Header<T, unknown>) => string;
      row?: (props: Row<T>) => string;
      cell?: (props: Cell<T, unknown>) => string;
    };
  };
