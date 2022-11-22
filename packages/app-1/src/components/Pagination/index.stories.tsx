import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import Pagination from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Pagination',
  component: Pagination,
  args: {
    itemsPerPage: 5,
    className: 'flex flex-gap-2',
    itemClassName: 'p-4 hover:underline',
    activeItemClassName: 'bg-blue-500 text-white disabled',
    count: 20
  }
} as ComponentMeta<typeof Pagination>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const ExternalCallback: ComponentStory<typeof Pagination> = (props) => {
  const [params, setParams] = useState({
    page: 1,
    first: 0,
    last: 0
  });
  return (
    <section>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <Pagination
        onChange={(_e, params) => {
          setParams(params);
        }}
        {...props}
      />
    </section>
  );
};
ExternalCallback.args = {};
