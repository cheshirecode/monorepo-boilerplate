import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { ExtraInternalTableProps, TableHookParams } from './typings';

const useTable = <T>(params: TableHookParams, extra?: ExtraInternalTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const columnHelper = createColumnHelper<T>();

  const { data = [] } = params;
  const { cellRenderer, customColumnDef } = extra ?? {};
  const columns = useMemo<ColumnDef<T>[]>(() => {
    const baseColumns = Object.keys(data[0] ?? {}).map((x) =>
      // @ts-expect-error
      columnHelper.accessor(x, {
        // accessorKey: x,
        // header: x,
        cell: (info) => {
          const v = info.getValue();
          const str = (() => {
            if ((v as Date)?.toLocaleString) {
              return (v as Date)?.toLocaleString();
            }
            if (v?.toString) {
              return v.toString();
            }
            return typeof v !== 'undefined' ? String(v) : null;
          })();
          return cellRenderer ? cellRenderer?.(info, str) : str;
        }
      })
    );
    // https://tanstack.com/table/v8/docs/guide/column-defs#column-helpers for more column types
    // columnHelper.display({
    //   id: 'actions',
    //   header: 'actions',
    //   footer: 'actions',
    //   cell: (props) => 'actions'
    // })
    return customColumnDef ? customColumnDef(baseColumns, columnHelper) : baseColumns;
  }, [cellRenderer, columnHelper, customColumnDef, data]);

  const table = useReactTable({
    ...params,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>()
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true
  });

  return {
    table,
    sorting,
    setSorting
  } as const;
};

export default useTable;
