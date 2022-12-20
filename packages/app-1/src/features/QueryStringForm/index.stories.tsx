import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import QueryStringForm from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'features/QueryStringForm',
  component: QueryStringForm
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof QueryStringForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof QueryStringForm> = (args) => {
  const [qs, setQs] = useState(args.queryString);
  return (
    <fieldset className="card-primary">
      <label htmlFor="internal">internal </label>
      <input name="internal" readOnly value={qs} className="" />
      <label htmlFor="given">given </label>
      <input name="given" readOnly value={args.queryString} className="" />
      <QueryStringForm {...args} onChange={setQs} />
    </fieldset>
  );
};

export const Default = Template.bind({});

Default.args = {
  queryString: 'k=0&k1=1&k2=2&k3='
};

export const PersistState = Template.bind({});

PersistState.args = {
  ...Default.args,
  persistState: true
};

export const OneReadOnly = Template.bind({});

OneReadOnly.args = {
  ...Default.args,
  fieldPropsByKey: (k) => (k === 'k' ? { readOnly: true } : {})
};
