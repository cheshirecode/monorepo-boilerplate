import { ComponentMeta, ComponentStory } from '@storybook/react';

import SearchBar from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/SearchBar',
  component: SearchBar
} as ComponentMeta<typeof SearchBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar className="h-10" {...args} />
);

export const Basic = Template.bind({});

Basic.args = {};
