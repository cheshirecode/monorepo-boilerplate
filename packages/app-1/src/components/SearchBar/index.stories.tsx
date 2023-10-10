import { ComponentMeta, ComponentStory } from '@storybook/react';

import SearchBar from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'features/SearchBar',
  component: SearchBar
} as ComponentMeta<typeof SearchBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SearchBar> = (args) => <SearchBar className="" {...args} />;

export const Basic = Template.bind({});

Basic.args = {};

export const NoButton = Template.bind({});

NoButton.args = {
  ...Basic.args,
  searchButtonText: ''
};
export const NoRoundedBorders = Template.bind({});

NoRoundedBorders.args = {
  ...Basic.args,
  roundedBorders: false
};

export const AutoComplete = Template.bind({});

AutoComplete.args = {
  ...Basic.args,
  searchIcon: true,
  searchButtonText: '',
  autoCompleteItems: [
    {
      name: 'Packages',
      value: 'packages'
    },
    {
      name: 'Distgroups',
      value: 'distgroups'
    },
    {
      name: 'Disthosts',
      value: 'Disthosts'
    }
  ],
  // eslint-disable-next-line no-console
  onAutoCompleteItemClicked: (v) => console.log('onAutoCompleteItemClicked', v)
};

export const Select = Template.bind({});

Select.args = {
  ...Basic.args,
  searchIcon: true,
  searchButtonText: '',
  options: [
    {
      name: 'N1',
      value: 'V1'
    },
    {
      name: 'Name2',
      value: 'Option2'
    }
  ],
  customSelect: false
};
export const CustomSelect = Template.bind({});

CustomSelect.args = {
  ...Select.args,
  customSelect: true
};
