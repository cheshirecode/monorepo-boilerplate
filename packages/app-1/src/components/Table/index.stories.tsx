/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import type { Person } from '@/services/api/mock';
import { makeData } from '@/services/api/mock';

import Table from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Table',
  component: Table
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Table<Person>>;

export const Basic: ComponentStory<typeof Table<Person>> = (args) => (
  <div className="w-full">
    <Table<Person> {...args} data={makeData(50)} />
  </div>
);
Basic.args = {
  className: '',
  enableColumnResizing: true,
  debugAll: true
};

export const Custom: ComponentStory<typeof Table<Person>> = (args) => (
  <div className="w-full">
    <Table<Person> {...args} data={makeData(50)} />
  </div>
);

Custom.args = {
  ...Basic.args,
  extra: {
    customColumnDef(cols, helper) {
      cols.push(
        helper.display({
          id: 'actions',
          header: ' actions',
          cell(props) {
            return `props.row - ${JSON.stringify(props?.row).length} chars`;
          }
        })
      );
      return cols;
    },
    cellRenderer(_props, v) {
      return <span>c - {v}</span>;
    }
  },
  classNameGetters: {
    header(props) {
      return `text-left header-${props.id}`;
    }
  }
};
