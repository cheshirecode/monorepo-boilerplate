import { useState } from 'react';

import type { PaginationProps } from '@/components/Pagination';
import { PlainPagination } from '@/components/Pagination';

import Table from './Table';
import useList from './useList';

const Integrated = <T extends Record<string, unknown>>(props: PaginationProps & { data: T[] }) => {
  const { data } = props;
  const [f, setF] = useState('');
  const [counter, setCounter] = useState(0);
  const listProps = useList(data.slice(0, props.count), {
    filter: {
      str: '',
      onChange: setF
    },
    pagination: {
      pageSize: props.pageSize,
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
        <PlainPagination {...props} {...listProps.pagination} />
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
        {/* <pre>{JSON.stringify(tableProps.table.getRowModel().rows, null, 2)}</pre> */}
        <Table<T> params={{ data: listProps.paginated }} />
      </div>
    </section>
  );
};

export default Integrated;
