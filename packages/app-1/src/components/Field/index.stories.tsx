import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import Field from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Field',
  component: Field
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Field>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Field> = (args) => {
  const [current, onChange] = useState(args.value);
  const [final, setV] = useState(args.value);
  return (
    <fieldset className="h-20 w-50">
      <dl className="grid grid-cols-2">
        <dt>onChange</dt>
        <dd>
          <input value={current} readOnly className="card-primary" />
        </dd>
        <dt>set</dt>
        <dd>{final}</dd>
      </dl>
      <Field {...args} value={final} set={setV} onChange={(v) => onChange(v)} />
    </fieldset>
  );
};

export const Default = Template.bind({});

Default.args = {
  name: 'name',
  value: 'default',
  iconClassName: '',
  inputClassName: '',
  readOnlyClassName: '',
  readOnly: false,
  className: 'font-gs-body01 outline outline-solid'
};

export const BigIcon = Template.bind({});

BigIcon.args = {
  ...Default.args,
  name: 'name',
  value: 'big icon',
  scale: 3
};

export const Readonly = Template.bind({});

Readonly.args = {
  ...Default.args,
  name: 'name',
  value: 'readOnly',
  readOnly: true
};

export const SaveOnBlur = Template.bind({});

SaveOnBlur.args = {
  ...Default.args,
  name: 'name',
  value: 'blur',
  saveOnBlur: true,
  displayValue: (v) => `custom (${v})`
};

export const NoConfirmation = Template.bind({});

NoConfirmation.args = {
  ...Default.args,
  name: 'name',
  value: 'noConfirmation',
  saveOnBlur: true,
  noConfirmation: true,
  displayValue: (v) => `custom (${v})`
};
