import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import Pagination from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Pagination',
  component: Pagination
} as ComponentMeta<typeof Pagination>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  itemsPerPage: 7,
  className: 'flex flex-gap-2',
  itemClassName: 'p-4 hover:underline',
  activeItemClassName: 'bg-blue-70 text-white disabled',
  count: 50
};

export const ExternalCallback: ComponentStory<typeof Pagination> = (props) => {
  const [params, setParams] = useState({});
  return (
    <section className="">
      <Pagination
        onChange={(_e, params) => {
          setParams(params);
        }}
        {...props}
      />
      <div className="">
        <pre>{JSON.stringify(props, null, 2)}</pre>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
    </section>
  );
};
ExternalCallback.args = {
  ...Basic.args,
  initialPage: 2
};

export const ZeroItems = ExternalCallback.bind({});
ZeroItems.args = {
  ...ExternalCallback.args,
  count: 0
};

export const TwoItems = ExternalCallback.bind({});
TwoItems.args = {
  ...ExternalCallback.args,
  count: 2,
  itemsPerPage: 1
};

export const MultiplePaginators: ComponentStory<typeof Pagination> = (props) => {
  const [params, setParams] = useState(props);
  const setter = (_e, params) => {
    setParams((v) => ({
      ...v,
      ...params,
      initialPage: params.initialPage ?? params.page
    }));
  };

  return (
    <section className="flex flex-col">
      <Pagination onChange={setter} {...params} />
      <Pagination onChange={setter} {...params} />
      <div className="">
        <pre>{JSON.stringify(props, null, 2)}</pre>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
    </section>
  );
};
MultiplePaginators.args = {
  ...Basic.args,
  initialPage: 2
};
