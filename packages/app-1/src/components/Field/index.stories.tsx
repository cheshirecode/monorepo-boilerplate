import { ComponentMeta, ComponentStory } from '@storybook/react';

import Field from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Field',
  component: Field
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Field>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Field> = (args) => (
  <fieldset className="h-20 w-50">
    <Field {...args} />
  </fieldset>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  name: 'name',
  value: 'default',
  // eslint-disable-next-line no-console
  set: (v) => console.log(v),
  iconClassName: '',
  className: 'font-gs-body01 outline outline-solid',
  readonly: false
};

export const BigIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BigIcon.args = {
  ...Default,
  name: 'name',
  value: 'big icon',
  // eslint-disable-next-line no-console
  set: (v) => console.log(v),
  iconClassName: 'h-full w-10',
  className: 'h-20 font-gs-body01 outline outline-solid',
  inputClassName: 'h-full',
  readOnlyClassName: '',
  readonly: false
};

export const Readonly = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Readonly.args = {
  name: 'name',
  value: 'readonly',
  // eslint-disable-next-line no-console
  set: (v) => console.log(v),
  iconClassName: '',
  className: 'font-gs-body01 outline outline-solid',
  readonly: true
};
