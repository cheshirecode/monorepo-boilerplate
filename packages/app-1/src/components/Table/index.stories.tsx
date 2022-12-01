/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Integrated from './Integrated';
import type { Person } from './mock';
import { makeData } from './mock';
import Table from './Table';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Table',
  component: Integrated
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Table<Person>>;

export const WrappedTable: ComponentStory<typeof Table<Person>> = (args) => (
  <div className="w-full">
    <Table {...args} table={{ data: makeData(1000) }} />
  </div>
);
WrappedTable.args = {};

export const IntegratedHooks: ComponentStory<typeof Integrated<Person>> = (args) => (
  <div className="w-full">
    <Integrated {...args} data={makeData(args.pagination.count)} />
  </div>
);
IntegratedHooks.args = {
  className: 'flex flex-gap-2',
  pagination: {
    itemClassName: 'p-4 hover:underline',
    activeItemClassName: 'bg-blue-70 bg-blue-700 text-white disabled',
    page: 2,
    pageSize: 301,
    count: 3999
  },
  table: {
    enableColumnResizing: true
  }
};
