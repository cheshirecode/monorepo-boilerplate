import type { ColumnDef, SortingState, TableOptions } from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const useTable = <T extends Record<string, unknown>>(
  params: Omit<
    TableOptions<T>,
    'columns' | 'state' | 'onSortingChange' | 'getCoreRowModel' | 'getSortedRowModel'
  >
) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const { data = [] } = params;
  const columns = useMemo<ColumnDef<T>[]>(
    () =>
      Object.keys(data[0] ?? {}).map((x) => ({
        accessorKey: x,
        header: x,
        cell: (info) => {
          const v = info.getValue();
          if ((v as Date)?.toLocaleString) {
            return (v as Date)?.toLocaleString();
          }
          if (v?.toString) {
            return v.toString();
          }
          return v;
        }
      })),
    [data]
  );

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
