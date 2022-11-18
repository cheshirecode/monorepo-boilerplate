import { ComponentMeta, ComponentStory } from '@storybook/react';
import Sections from './Sections';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'layouts/Sections',
  component: Sections,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof Sections>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof Sections> = ({ Extra, ...args }) => (
  <section className="flex flex-col border shadow-lg bg-lime-50">
    {Extra ? Extra : null}
    <Sections {...args} />
  </section>
);

export const Basic = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {};

export const DifferentIndex = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DifferentIndex.args = {
  activeIndex: 2
};

export const InferHash = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InferHash.args = {
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #section-2 in URL hash</code>
};

export const InferQueryParams = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InferQueryParams.args = {
  inferQueryParams: true,
  // @ts-expect-error
  Extra: <code>open with ?sectionHash=2 in URL hash</code>
};

export const StickyNav = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
StickyNav.args = {
  stickyNav: true,
  activeIndex: 1,
  className: 'h-100'
};

export const StickyNavWithStyle = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
StickyNavWithStyle.args = {
  stickyNav: true,
  activeIndex: 1,
  style: {
    height: '25rem'
  }
};


export const StickyNavWithInferredHash = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
StickyNavWithInferredHash.args = {
  stickyNav: true,
  activeIndex: 1,
  className: 'h-100',
  contentClassName: 'h-[1000px]',
  inferHash: true,
  // @ts-expect-error
  Extra: <code>open with #section-2 in URL hash</code>
};
