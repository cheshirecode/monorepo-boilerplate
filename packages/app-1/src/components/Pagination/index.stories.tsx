import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import usePagination from './usePagination';

import Pagination, { PlainPagination } from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Pagination',
  component: Pagination
} as ComponentMeta<typeof Pagination>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  className: 'flex flex-gap-2',
  itemClassName: '',
  activeItemClassName: '',
  disabledItemClassName: '',
  pageSize: 7,
  count: 50,
  isRollover: false
};

export const IsRollOver = Template.bind({});
IsRollOver.args = {
  ...Basic.args,
  isRollover: true
};

export const ShowAllPages = Template.bind({});
ShowAllPages.args = {
  ...Basic.args,
  showAllPages: true
};

export const ExternalCallback: ComponentStory<typeof Pagination> = (props) => {
  const [params, setParams] = useState({});
  return (
    <section className="">
      <Pagination onChange={setParams} {...props} />
      <div className="">
        <pre>{JSON.stringify(props, null, 2)}</pre>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
    </section>
  );
};
ExternalCallback.args = {
  ...Basic.args,
  page: 2
};

export const ZeroItems: ComponentStory<typeof Pagination> = (props) => (
  <>
    <pre>isHiddenIfOnePage=true to force-display paginator</pre>
    <ExternalCallback {...props} />
  </>
);
ZeroItems.args = {
  ...ExternalCallback.args,
  count: 0
};

export const TwoItems = ExternalCallback.bind({});
TwoItems.args = {
  ...ExternalCallback.args,
  count: 2,
  pageSize: 1
};

export const UsePagination: ComponentStory<typeof Pagination> = (props) => {
  const [counter, setCounter] = useState(0);
  const extraProps = usePagination({
    ...props,
    onChange: () => setCounter((v) => ++v)
  });

  return (
    <section className="flex flex-col">
      <PlainPagination {...props} {...extraProps} />
      <div className="">
        <pre>perform filtering or pagination to see counter go up - {counter}</pre>
        <pre>returned props from hook</pre>
        <pre>{JSON.stringify(extraProps, null, 2)}</pre>
      </div>
    </section>
  );
};
UsePagination.args = {
  ...Basic.args,
  page: 2
};

export const UsePaginationWithPageSizes: ComponentStory<typeof Pagination> = (props) => {
  const [counter, setCounter] = useState(0);
  const extraProps = usePagination({
    ...props,
    onChange: () => setCounter((v) => ++v)
  });

  return (
    <section className="flex flex-col">
      {props.pageSize && (
        <div>
          <label htmlFor="pageSize">page size</label>
          <select
            id="pageSize"
            value={Number(extraProps.pageSize)}
            onChange={(e) => extraProps.setPageSize(Number(e.currentTarget.value))}
          >
            {extraProps.pageSizes.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
      )}
      <PlainPagination {...props} {...extraProps} />
      <div className="">
        <pre>perform filtering or pagination to see counter go up - {counter}</pre>
        <pre>returned props from hook</pre>
        <pre>{JSON.stringify(extraProps, null, 2)}</pre>
      </div>
    </section>
  );
};
UsePaginationWithPageSizes.args = {
  ...Basic.args,
  page: 2,
  count: 50000,
  pageSize: 9999
};

export const UsePaginationWithMultiplePaginators: ComponentStory<typeof Pagination> = (props) => {
  const [counter, setCounter] = useState(0);
  const extraProps = usePagination({
    ...props,
    onChange: () => setCounter((v) => ++v)
  });

  return (
    <section className="flex flex-col">
      <PlainPagination {...props} {...extraProps} />
      <div className="">
        <PlainPagination {...props} {...extraProps} showAllPages />
        <pre>perform filtering or pagination to see counter go up - {counter}</pre>
        <pre>returned props from hook</pre>
        <pre>{JSON.stringify(extraProps, null, 2)}</pre>
      </div>
      <PlainPagination {...props} {...extraProps} />
    </section>
  );
};
UsePaginationWithMultiplePaginators.args = {
  ...Basic.args,
  page: 2
};
