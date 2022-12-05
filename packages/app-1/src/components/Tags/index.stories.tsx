import { ComponentMeta, ComponentStory } from '@storybook/react';

import Tags from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Tags',
  component: Tags,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Tags>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tags> = ({ ...args }) => <Tags {...args} />;

export const Basic = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {
  className: 'border p-4 w-100',
  itemClassName: 'border border-1-black py-1 px-2 rounded-full mix-blend-difference',
  items: Array(20)
    .fill(0)
    .map(() =>
      Math.random()
        .toString()
        .slice(0, Math.ceil(Math.random() * 10 + 2))
    )
};
