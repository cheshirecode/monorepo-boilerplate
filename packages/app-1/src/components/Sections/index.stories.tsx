import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';

import Sections from './';

const dummyItems: ItemsType = [
  {
    id: 'section-1',
    name: 'section 1 is very short',
    content: <div className="w-full h-10 bg-red-7"></div>
  },
  {
    id: 'section-2',
    name: 'section 2 has long name and has longform content. name stays on 1 line if itemFitContent=true',
    content: (
      <div className="w-full bg-red h-[60rem]">
        <div className="w-full h-1/2 bg-black"></div>
      </div>
    )
  },
  {
    id: 'section-3',
    name: 'section 3',
    content: <div className="w-full h-60 bg-yellow-100"></div>
  },
  {
    id: 'section-4',
    name: 'section 4',
    content: <div className="w-full h-60 bg-blue-700"></div>
  },
  {
    id: 'section-5',
    name: 'section 5',
    content: <div className="w-full h-60 bg-green-50"></div>
  }
];

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
const Template: ComponentStory<typeof Sections> = ({ Extra, ...args }) => {
  return (
    <section className="flex flex-col border shadow-lg bg-lime-50 dark:bg-lime-900 w-full h-full overflow-hidden">
      <Sections
        Pre={
          <div className="max-h-30 flex flex-wrap children:(h-10 w-full relative)">
            <code>static heading </code>
            {Extra ? Extra : null}
            <code>post-extra </code>
          </div>
        }
        {...args}
      />
      <p>block after sections</p>
    </section>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  items: dummyItems,
  stickyNav: false,
  activeIndex: 0,
  className: 'uno-layer-o:h-100',
  contentClassName: 'uno-layer-o:h-[1000px]',
  inferHash: false
};

export const WithItems = Template.bind({});
WithItems.args = {
  ...Basic.args,
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
  ]
};

export const DifferentIndex = Template.bind({});
DifferentIndex.args = {
  ...Basic.args,
  activeIndex: 2
};

export const InferHash = Template.bind({});
InferHash.args = {
  ...Basic.args,
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #section-2 in URL hash</code>
};

export const InferQueryParams = Template.bind({});
InferQueryParams.args = {
  ...Basic.args,
  inferQueryParams: true,
  // @ts-expect-error
  Extra: <code>open with ?sectionHash=2 in URL hash</code>
};

export const StickyNav = Template.bind({});
StickyNav.args = {
  ...Basic.args,
  stickyNav: true,
  activeIndex: 1,
  className: 'uno-layer-o:h-100',
  // @ts-expect-error
  Extra: <code>scroll on lengthy items to see nav stick to top</code>
};

export const StickyNavWithStyle = Template.bind({});
StickyNavWithStyle.args = {
  ...Basic.args,
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
  ...Basic.args,
  stickyNav: true,
  activeIndex: 1,
  className: 'uno-layer-o:h-100',
  contentClassName: 'uno-layer-o:h-[1000px]',
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #section-2 in URL hash</code>
};

export const WithScrollTopCallback = Template.bind({});
WithScrollTopCallback.args = {
  ...Basic.args,
  stickyNav: true,
  activeIndex: 1,
  className: 'uno-layer-o:h-100',
  contentClassName: 'uno-layer-o:h-[1000px]',
  // eslint-disable-next-line no-console
  cbScrollTop: (x) => console.log('cbScrollTop', x),
  contentOffset: '7.5rem',
  // @ts-expect-error
  Extra: <code>scroll then check console log</code>
};

export const WithScrollOnIndexChange = Template.bind({});
WithScrollOnIndexChange.args = {
  ...Basic.args,
  stickyNav: true,
  activeIndex: 1,
  className: 'uno-layer-o:h-100',
  contentClassName: 'uno-layer-o:h-[1000px]',
  // eslint-disable-next-line no-console
  cbScrollTop: (x) => console.log('cbScrollTop', x),
  scrollTopOnIndexChange: true,
  // @ts-expect-error
  Extra: <code>scroll down, click on a new section link to see auto-scrolling to top</code>
};

export const FullyEnabledWithTenItems = Template.bind({});
FullyEnabledWithTenItems.args = {
  ...Basic.args,
  stickyNav: true,
  activeIndex: 1,
  className: 'uno-layer-o:h-[800px]',
  scrollTopOnIndexChange: true,
  // eslint-disable-next-line no-console
  cbScrollTop: (x) => console.log('cbScrollTop', x),
  contentOffset: '7.5rem',
  inferHash: true,
  inferQueryParams: true,
  itemFitContent: true,
  // @ts-expect-error
  Extra: <code>play with it</code>,
  items: Array<typeof dummyItems>(2)
    .fill(dummyItems)
    .flatMap((x, i) =>
      x.map((y, j) => ({
        ...y,
        id: `${i * dummyItems.length + j}-${y.id}`,
        name: `${i * dummyItems.length + j}-${y.name}`
      }))
    )
};

export const FullyEnabledWithManyItems = Template.bind({});
FullyEnabledWithManyItems.args = {
  ...FullyEnabledWithTenItems.args,
  items: Array<typeof dummyItems>(50)
    .fill(dummyItems)
    .flatMap((x, i) =>
      x.map((y, j) => ({
        ...y,
        id: `${i * dummyItems.length + j}-${y.id}`,
        name: `${i * dummyItems.length + j}-${y.name}`
      }))
    )
};

export const FullyEnabledWithOverlappedSiblings = Template.bind({});
FullyEnabledWithOverlappedSiblings.args = {
  ...FullyEnabledWithManyItems.args,
  // @ts-expect-error
  Extra: (
    <code className="sticky top-0 h-40 w-40 bg-cyan z-1 ">
      this is atop Sections&apos; nav menu due to z-index 1. set Sections&apos; z-index to &gt;= 1
      to reverse this
    </code>
  ),
  className: cx(FullyEnabledWithManyItems.args.className, 'z-0'),
  // activeIndex: 0,
  scrollTopOnIndexChange: false
};
