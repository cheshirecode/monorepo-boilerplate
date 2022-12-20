import { ComponentMeta, ComponentStory } from '@storybook/react';

import Download from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Download',
  component: Download,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Download>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof Download> = ({ ...args }) => (
  <section className="bg-secondary flex w-100">
    click to copy <Download {...args} />{' '}
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
  children: 'download'
};
