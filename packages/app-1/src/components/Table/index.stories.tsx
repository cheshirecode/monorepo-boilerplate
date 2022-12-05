import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';

import type { PackageVersion } from '@/services/mocks/mock';
import { mockPackageVersions } from '@/services/mocks/mock';

import Table from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Table',
  component: Table
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Table<PackageVersion>>;

export const Basic: ComponentStory<typeof Table<PackageVersion>> = (args) => (
  <div className="w-full">
    <Table<PackageVersion> {...args} />
  </div>
);
Basic.args = {
  className: '',
  enableColumnResizing: true,
  debugAll: true,
  data: mockPackageVersions(50, 2)
};

export const CustomStyle: ComponentStory<typeof Table<PackageVersion>> = (args) => (
  <div className="w-full">
    <Table<PackageVersion> {...args} />
  </div>
);

CustomStyle.args = {
  ...Basic.args,
  extra: {
    createColumnDefs(colDefs, helper) {
      colDefs.push(
        helper.display({
          id: 'actions',
          header: ' actions',
          cell(props) {
            return `props.row - ${JSON.stringify(props?.row).length} chars`;
          }
        })
      );
      return colDefs;
    },
    cellRenderer(_props, v) {
      return <span>c - {v}</span>;
    }
  },
  classNameGetters: {
    header: (props) =>
      cx(
        'text-left',
        `header-${props.id}`,
        props.column.id === 'id' && 'bg-lime-600',
        props.column.id === 'createdAt' && 'bg-gray-600 text-light-400'
      ),
    cell: (props) => `text-right border border-blue-70 border-blue-700 cell-${props.id}`,
    row: (props) => `border-2 border-black row-${props.id}`
  }
};

export const ExpandableRow: ComponentStory<typeof Table<PackageVersion>> = (args) => (
  <div className="w-full">
    <Table<PackageVersion> {...args} />
  </div>
);

ExpandableRow.args = {
  ...CustomStyle.args,
  getRowCanExpand: () => true,
  extra: {
    ...CustomStyle.args.extra,
    createColumnDefs(colDefs, helper) {
      const newColDefs = [
        helper.display({
          id: 'expander',
          header: () => null,
          size: 10,
          cell: ({ row }) =>
            row.getCanExpand() ? (
              <button onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              '🔵'
            )
        })
      ].concat(colDefs);
      return newColDefs;
    },
    subRowRenderer: (row) => (
      <pre>
        <code>{JSON.stringify(row.original, null, 2)}</code>
      </pre>
    )
  },
  classNameGetters: {
    ...CustomStyle.args.classNameGetters,
    cell: (props) =>
      cx(
        props.column.id !== 'expander' && 'text-right',
        'border border-blue-70 border-blue-700',
        `cell-${props.id}`
      )
  }
};
