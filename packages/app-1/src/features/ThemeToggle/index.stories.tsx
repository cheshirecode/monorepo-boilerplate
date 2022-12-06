import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';
import { useState } from 'react';

import { applyTheme, getTheme } from './utils';

import ThemeToggle from './';

applyTheme();
const Theme = ({ className, ...props }: BaseProps) => {
  const [theme, setTheme] = useState(getTheme());
  return (
    <section className={cx('w-[400px] relative border-1 border-primary p-2', className)} {...props}>
      <ThemeToggle isApply={false} onChange={setTheme} className="absolute right-2" />
      <code>click to toggle dark/light mode</code>
      <div className="flex flex-col flex-gap-2 w-fit p-2">
        <code>current theme - {theme}</code>
        <span className="color-primary">color-primary</span>
        <span className="color-primary-fade">color-primary-fade</span>
        <span className="color-secondary">color-secondary</span>
      </div>
    </section>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'features/ThemeToggle',
  component: Theme,
  args: {}
} as ComponentMeta<typeof Theme>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Theme> = (args) => <Theme {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
