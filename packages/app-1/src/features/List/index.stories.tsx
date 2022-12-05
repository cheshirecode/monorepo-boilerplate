/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import type { Person } from '@/services/mocks/mock';
import { makeData } from '@/services/mocks/mock';

import Example from './Example';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'features/List',
  component: Example
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Example<Person>>;

export const Params: ComponentStory<typeof Example<Person>> = (args) => (
  <div className="w-full">
    <Example<Person> {...args} data={makeData(Number(args.pagination.count))} />
  </div>
);
Params.args = {
  className: '',
  pagination: {
    itemClassName: 'p-4 hover:underline',
    activeItemClassName: 'bg-blue-70 bg-blue-700 text-white disabled',
    disabledItemClassName: 'text-gray-200 text-gray-20 disabled',
    page: 2,
    pageSize: 1000,
    count: 100000
  }
};

export const ToTable: ComponentStory<typeof Example<Person>> = (args) => (
  <div className="w-full">
    <Example<Person> {...args} data={makeData(Number(args.pagination.count))} />
  </div>
);
ToTable.args = {
  ...Params.args,
  pagination: {
    ...Params.args.pagination,
    pageSize: 100,
    count: 1000
  },
  table: {
    enableColumnResizing: true,
    debugAll: true
  }
};
