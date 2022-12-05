import { ComponentMeta, ComponentStory } from '@storybook/react';

import Board from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Board',
  component: Board,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Board>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof Board> = ({ ...args }) => <Board {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  className: 'border p-4',
  itemClassName: 'bg-blue-50 bg-blue-500 text-white',
  items: Array(22)
    .fill(0)
    .map(() =>
      Math.random() >= 0.5
        ? Math.random()
            .toString()
            .slice(0, Math.ceil(Math.random() * 10 + 2))
        : ''
    )
};

export const Two = Template.bind({});
Two.args = {
  ...Basic.args,
  middleSpan: 2
};

export const Three = Template.bind({});
Three.args = {
  ...Basic.args,
  middleSpan: 3
};
