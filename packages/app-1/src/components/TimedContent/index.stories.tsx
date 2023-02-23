import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';

import TimedContent from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/TimedContent',
  component: TimedContent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof TimedContent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// @ts-expect-error
const Template: ComponentStory<typeof TimedContent> = (args) => {
  return (
    <section>
      <header>
        <b>before</b>
      </header>
      <TimedContent {...args} />
      <footer>
        <em>after</em>
      </footer>
    </section>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  className: 'card-information relative w-100 h-20 flex justify-center items-center',
  children: 'placeholder - 1 - 2 - 3',
  timings: [
    {
      time: 500,
      content: (
        <span className={cx('absolute top-0 left-0 animate-fade-out opacity-0')}>1 - 2 in 1s</span>
      )
    },
    {
      time: 1500,
      content: () => (
        <span className={cx('absolute bottom-0 right-0 animate-fade-out opacity-0')} key="2">
          2 - 3 in 1s
        </span>
      )
    },
    {
      time: 2000,
      content: () => <span className={cx('')}>3</span>
    }
  ]
};

export const Nested = Template.bind({});

Nested.args = {
  className: 'card-secondary relative w-200 h-40 flex justify-center items-center',
  children: 'placeholder - nested - placeholder',
  timings: [
    {
      time: 0,
      content: <Basic {...Basic.args} />
    },
    {
      time: 2500,
      content: <span className="absolute bottom-0 right-0">back to before...</span>
    },
    {
      time: 3000
    }
  ]
};
