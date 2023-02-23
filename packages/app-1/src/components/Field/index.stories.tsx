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
const Template: ComponentStory<typeof Field> = ({ autoCompleteItems, ...args }) => {
  const [current, onChange] = useState(args.value);
  const [final, setV] = useState(args.value);
  const [aci, setAci] = useState(autoCompleteItems);
  return (
    <fieldset className="h-20 w-100">
      <dl className="grid grid-cols-2">
        <dt>onChange</dt>
        <dd>
          <input value={current} readOnly className="card-primary" />
        </dd>
        <dt>final committed value</dt>
        <dd>
          <input
            value={final}
            onChange={(e) => setV(e?.currentTarget?.value)}
            className="card-primary"
          />
        </dd>
      </dl>
      <Field
        {...args}
        autoCompleteItems={aci}
        value={final}
        set={setV}
        onChange={(v) => {
          onChange(v);
          setAci((v) => {
            const shuffled = [...(v ?? [])].sort(() => Math.random() - 0.5);
            return shuffled;
          });
        }}
      />
      <b>after field</b>
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
  className: 'font-mono outline outline-solid'
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

export const AutoCompleteWithConfirmation = Template.bind({});

AutoCompleteWithConfirmation.args = {
  ...Default.args,
  saveOnBlur: false,
  noConfirmation: false,
  autoCompleteItems: [
    {
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    },
    {
      name: 'sed do eiusmod tempor incididunt',
      value: 'sed do eiusmod tempor incididunt'
    },
    {
      name: 'ut labore et dolore magna aliqua',
      value: 'ut labore et dolore magna aliqua'
    },
    {
      name: 'Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae',
      value: 'Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae'
    },
    {
      name: 'Enim nec dui nunc mattis enim ut tellus elementum',
      value: 'Enim nec dui nunc mattis enim ut tellus elementum'
    },
    {
      name: 'Mauris cursus mattis molestie a',
      value: 'Mauris cursus mattis molestie a'
    },
    {
      name: 'iaculis at erat pellentesque adipiscing',
      value: 'iaculis at erat pellentesque adipiscing'
    }
  ]
};

export const AutoCompleteWithSaveOnBlur: ComponentStory<typeof Field> = (args) =>
  Array(2)
    .fill(0)
    .map((_x, i) => <Template key={i} {...args} />);
AutoCompleteWithSaveOnBlur.args = {
  ...AutoCompleteWithConfirmation.args,
  saveOnBlur: true,
  noConfirmation: true
};
