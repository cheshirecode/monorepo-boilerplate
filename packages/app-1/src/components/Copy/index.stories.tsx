import { ComponentMeta, ComponentStory } from '@storybook/react';

import Copy from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Copy',
  component: Copy,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Copy>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof Copy> = ({ ...args }) => (
  <section className="bg-secondary flex w-100 self-center">
    click to copy <Copy {...args} />{' '}
  </section>
);

export const Basic = Template.bind({});

Basic.args = {
  className: 'btn-primary mr-0 ml-auto',
  data: 'random text'
};

export const MoreData = Template.bind({});

MoreData.args = {
  ...Basic.args,
  data: {
    text: 'random text'
  }
};

export const CustomIcon = Template.bind({});

CustomIcon.args = {
  ...Basic.args,
  children: 'copy'
};
