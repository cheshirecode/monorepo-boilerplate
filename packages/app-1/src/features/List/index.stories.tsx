/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import type { Person } from '@/services/api/mock';
import { makeData } from '@/services/api/mock';

import Example from './Example';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'features/List',
  component: Example
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Example<Person>>;

export const ToTable: ComponentStory<typeof Example<Person>> = (args) => (
  <div className="w-full">
    <Example<Person> {...args} data={makeData(Number(args.pagination.count))} />
  </div>
);
ToTable.args = {
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
