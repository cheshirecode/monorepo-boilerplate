import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import Sections, { dummyItems } from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/Sections',
  component: Sections,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Sections>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof Sections> = ({ Extra, cbScrollTop, ...args }) => {
  const [showHeading, setShowHeading] = useState(true);
  const fn = (x) => {
    if (cbScrollTop) {
      cbScrollTop(x);
      setShowHeading(x === 0);
    }
  };
  return (
    <section className="flex flex-col border shadow-lg bg-lime-50 w-full h-full overflow-hidden">
      {showHeading && (
        <div className="h-30">
          <p>static heading </p>
          {Extra ? Extra : null}
        </div>
      )}
      <Sections {...args} cbScrollTop={fn} />
      <p>block after sections</p>
    </section>
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const WithItems = Template.bind({});
WithItems.args = {
  items: [
    {
      id: 'custom-section-1',
      name: '1 is very short',
      content: <div className="w-full h-10 bg-red-7"></div>
    },
    {
      id: 'custom-section-2',
      name: '2 has long name and big height',
      content: (
        <div className="w-full h-full bg-turquoise-40">
          <div className="w-full h-1/2 bg-black"></div>
        </div>
      )
    }
  ],
  stickyNav: true,
  activeIndex: 0,
  className: 'h-100',
  contentClassName: 'h-[1000px]',
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #custom-section-2 in URL hash</code>
};

export const DifferentIndex = Template.bind({});
DifferentIndex.args = {
  activeIndex: 2
};

export const InferHash = Template.bind({});
InferHash.args = {
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #section-2 in URL hash</code>
};

export const InferQueryParams = Template.bind({});
InferQueryParams.args = {
  inferQueryParams: true,
  // @ts-expect-error
  Extra: <code>open with ?sectionHash=2 in URL hash</code>
};

export const StickyNav = Template.bind({});
StickyNav.args = {
  stickyNav: true,
  activeIndex: 1,
  className: 'h-100',
  // @ts-expect-error
  Extra: <code>scroll on lengthy items to see nav stick to top</code>
};

export const StickyNavWithStyle = Template.bind({});
StickyNavWithStyle.args = {
  stickyNav: true,
  activeIndex: 1,
  style: {
    height: '25rem'
  },
  // @ts-expect-error
  Extra: <code>scroll on lengthy items to see nav stick to top</code>
};

export const StickyNavWithInferredHash = Template.bind({});
StickyNavWithInferredHash.args = {
  stickyNav: true,
  activeIndex: 1,
  className: 'h-100',
  contentClassName: 'h-[1000px]',
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #section-2 in URL hash</code>
};

export const WithScrollTopCallback = Template.bind({});
WithScrollTopCallback.args = {
  stickyNav: true,
  activeIndex: 1,
  className: 'h-100',
  contentClassName: 'h-[1000px]',
  // eslint-disable-next-line no-console
  cbScrollTop: (x) => console.log('cbScrollTop', x),
  contentOffset: '7.5rem',
  // @ts-expect-error
  Extra: <code>scroll then check console log</code>
};

export const WithScrollOnIndexChange = Template.bind({});
WithScrollOnIndexChange.args = {
  stickyNav: true,
  activeIndex: 1,
  className: 'h-100',
  contentClassName: 'h-[1000px]',
  scrollTopOnIndexChange: true,
  // @ts-expect-error
  Extra: <code>scroll down, click on a new section link to see auto-scrolling to top</code>
};

export const FullyEnabledWithTenItems = Template.bind({});
FullyEnabledWithTenItems.args = {
  items: Array<typeof dummyItems>(2)
    .fill(dummyItems)
    .flatMap((x, i) =>
      x.map((y, j) => ({
        ...y,
        id: `${i * dummyItems.length + j}-${y.id}`,
        name: `${i * dummyItems.length + j}-${y.name}`
      }))
    ),
  stickyNav: true,
  activeIndex: 2,
  className: 'h-[800px]',
  navClassName: 'h-[100px]',
  // contentClassName: 'h-[600px]',
  scrollTopOnIndexChange: true,
  // eslint-disable-next-line no-console
  cbScrollTop: (x) => console.log('cbScrollTop', x),
  contentOffset: '7.5rem',
  inferHash: true,
  inferQueryParams: true,
  // @ts-expect-error
  Extra: <code>play with it</code>
};

export const FullyEnabledWithManyItems = Template.bind({});
FullyEnabledWithManyItems.args = {
  items: Array<typeof dummyItems>(50)
    .fill(dummyItems)
    .flatMap((x, i) =>
      x.map((y, j) => ({
        ...y,
        id: `${i * dummyItems.length + j}-${y.id}`,
        name: `${i * dummyItems.length + j}-${y.name}`
      }))
    ),
  stickyNav: true,
  activeIndex: 2,
  className: 'h-[800px]',
  navClassName: 'h-[100px]',
  // contentClassName: 'h-[600px]',
  scrollTopOnIndexChange: true,
  // eslint-disable-next-line no-console
  cbScrollTop: (x) => console.log('cbScrollTop', x),
  contentOffset: '7.5rem',
  inferHash: true,
  inferQueryParams: true,
  // @ts-expect-error
  Extra: <code>play with it</code>
};
