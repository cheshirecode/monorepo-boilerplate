import { ComponentMeta, ComponentStory } from '@storybook/react';

import { newPerson } from '@/services/mocks/mock';

import Details from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Details',
  component: Details,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Details>;

const Container = ({ children }) => <section className="flex flex-col max-w-full card-primary p-0 m-0">{children}</section>;

export const Full: ComponentStory<typeof Details> = ({ n, ...args }) => (
  <Container>
    {Array(n)
      .fill(0)
      .map((_x, i) => (
        <Details key={i} {...args} data={newPerson()} />
      ))}
  </Container>
);

Full.args = {
  className: 'grid responsive-grid-kv gap-2 border border-primary',
  labelClassName: 'px-2 color-secondary opacity-60',
  fieldClassName: 'px-2 color-primary truncate',
  fieldCopy: true,
  n: 11,
  metadata: {
    firstName: {
      label: {
        className: 'col-span-full'
      },
      field: {
        className: 'col-span-full'
      }
    },
    lastName: {
      label: {
        fullLinePre: true
      },
      field: {
        className: 'col-start-2 col-end--1'
      }
    }
  }
};