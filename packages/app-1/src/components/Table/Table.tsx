/* eslint-disable no-unreachable */
import type { TableOptions } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import cx from 'classnames';
import { useReducer } from 'react';

// import './integrated.css';
import useTable from './useTable';

const Table = <T extends Record<string, unknown>>(
  props: BaseProps & {
    params: Required<Pick<TableOptions<T>, 'data'>> & Partial<Omit<TableOptions<T>, 'data'>>;
  }
) => {
  const {
    params: { data, enableColumnResizing = true, ...p },
    className
  } = props;
  const rerender = useReducer(() => ({}), {})[1];

  const { table, sorting } = useTable({
    data,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    ...p
  });

  return (
    <div
      className={cx('p-2 block max-w-full overflow-x-scroll overflow-y-hidden', className)}
      {...props}
    >
      <div className="h-2" />
      <table className="w-full ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...(enableColumnResizing
                        ? { position: 'relative', width: header.getSize() }
                        : {})
                    }}
                    className="group"
                  >
                    {header.isPlaceholder ? null : (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler()
                        }}
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
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        ...(enableColumnResizing ? { width: cell.column.getSize() } : {})
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
    </div>
  );
};

export default Table;
