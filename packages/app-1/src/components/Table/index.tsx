/* eslint-disable no-unreachable */
import { flexRender } from '@tanstack/react-table';
import cx from 'classnames';
import { useReducer } from 'react';

// import './integrated.css';
import { TableProps } from './typings';
import useTable from './useTable';

const Table = <T,>(props: TableProps<T>) => {
  const {
    data,
    enableColumnResizing = false,
    enableRowSelection = false,
    extra,
    className,
    classNameGetters,
    ...p
  } = props;
  const rerender = useReducer(() => ({}), {})[1];

  const { table, sorting } = useTable(
    {
      data,
      enableColumnResizing,
      enableRowSelection,
      columnResizeMode: 'onChange',
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      ...p
    },
    extra
  );

  return (
    <div className={cx('w-full overflow-x-scroll overflow-y-hidden', className)}>
      <table className="w-full ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    ...(enableColumnResizing
                      ? { position: 'relative', width: header.getSize() }
                      : {})
                  }}
                  className={cx('group')}
                >
                  {header.isPlaceholder ? null : (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      className={cx(
                        header.column.getCanSort() && 'cursor-pointer select-none',
                        classNameGetters?.header?.(header)
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽'
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                  {enableColumnResizing && header.column.getCanResize() && (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cx(
                        'absolute right-0 top-0 h-full w-1 bg-gray',
                        'cursor-col-resize select-none touch-none',
                        'opacity-0 group-hover:(opacity-100)',
                        // 'resizer',
                        header.column.getIsResizing() &&
                          'isResizing bg-blue-70 bg-blue-700  opacity-100'
                      )}
                    ></div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={cx(classNameGetters?.row?.(row))}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    ...(enableColumnResizing ? { width: cell.column.getSize() } : {})
                  }}
                  className={cx(classNameGetters?.cell?.(cell))}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {p.debugAll && (
        <div className="flex flex-wrap flex-gap-2">
          <div>{table.getRowModel().rows.length} Rows</div>
          <button className="btn" onClick={rerender}>
            Force Rerender
          </button>
          <pre>{JSON.stringify(sorting, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Table;