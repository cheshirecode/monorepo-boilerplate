import { useState } from 'react';

import { PlainPagination } from '@/components/Pagination';
import Table from '@/components/Table';

import type { ListProps } from './typings';
import useList from './useList';

const Example = <T extends Record<string, unknown>>(props: ListProps<T>) => {
  const { data, pagination, table } = props;
  const [f, setF] = useState('');
  const [counter, setCounter] = useState(0);
  const listProps = useList(data, {
    filter: {
      str: '',
      onChange: setF
    },
    pagination: {
      pageSize: pagination.pageSize,
      onChange: () => setCounter((v) => ++v)
    }
  });

  return (
    <section className="flex flex-col">
      <fieldset>
        <label htmlFor="filter">filter</label>
        <input
          id="filter"
          type="text"
          value={listProps.filter.str}
          onChange={(e) => {
            listProps.filter.set(e.currentTarget.value);
          }}
          className="border border-blue"
        />
      </fieldset>
      <div>
        <label htmlFor="pageSize">page size</label>
        <select
          id="pageSize"
          value={Number(listProps.pagination.pageSize)}
          onChange={(e) => listProps.pagination.setPageSize(Number(e.currentTarget.value))}
        >
          {listProps.pagination.pageSizes.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <PlainPagination {...pagination} {...listProps.pagination} />
      </div>
      <div className="">
        <h3>list</h3>
        <pre>filter string - {f}</pre>
        <pre>perform filtering or pagination to see counter go up - {counter}</pre>
        <pre>filter</pre>
        <pre>{JSON.stringify(listProps.filter, null, 2)}</pre>
        <pre>filtered - {listProps.filtered.length}</pre>
        <pre>pagination</pre>
        <pre>{JSON.stringify(listProps.pagination, null, 2)}</pre>
        <pre>paginated - {listProps.paginated.length}</pre>
      </div>

      <div className="flex flex-col">
        <h3>table</h3>
        {/* <pre>{JSON.stringify(InternalTableProps.table.getRowModel().rows, null, 2)}</pre> */}
        <Table<T> data={listProps.paginated} {...table} />
      </div>
    </section>
  );
};

export default Example;
