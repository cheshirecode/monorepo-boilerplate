import { ComponentMeta, ComponentStory } from '@storybook/react';

import Spinner from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Spinner',
  component: Spinner,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Spinner>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof Spinner> = ({ ...args }) => <Spinner {...args} />;

export const Default = Template.bind({});

Default.args = {
  className: ''
};

export const Small = Template.bind({});

Small.args = {
  ...Default.args,
  size: 'small'
};

export const LargeInsetTertiary = Template.bind({});

LargeInsetTertiary.args = {
  ...Default.args,
  size: 'large',
  type: 'inset',
  palette: 'tertiary'
};

export const LargeScreen = Template.bind({});

LargeScreen.args = {
  ...Default.args,
  size: 'large',
  screen: true,
  screenClassName: 'bg-contrast'
};

export const LargeWarningMoonScreen = Template.bind({});

LargeWarningMoonScreen.args = {
  ...LargeScreen.args,
  type: 'moon',
  palette: 'warning'
};
