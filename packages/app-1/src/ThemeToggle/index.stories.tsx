import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';
import { useState } from 'react';

import {
  bgHoveredPalette,
  bgPalette,
  borderPalette,
  buttonPalette,
  cardHoveredPalette,
  cardPalette,
  colorHoveredPalette,
  colorPalette
} from '@/styles/palette';

import { getTheme } from './utils';

import ThemeToggle from './';

const colorPaletteValues = Object.values(colorPalette);
const colorHoveredPaletteValues = Object.values(colorHoveredPalette);
const bgPaletteValues = Object.values(bgPalette);
const bgHoveredPaletteValues = Object.values(bgHoveredPalette);
const borderPaletteValues = Object.values(borderPalette);
const buttonPaletteValues = Object.values(buttonPalette);
const partialBorderPalette = ['border-t-1', 'border-r-1', 'border-b-1', 'border-l-1'];
const Theme = ({ className, ...props }: BaseProps) => {
  const [theme, setTheme] = useState(getTheme());
  return (
    <section className={cx('w-fit relative border-1 border-primary p-2', className)} {...props}>
      <ThemeToggle isApply={false} onChange={setTheme} className="absolute right-2" />
      <code>click to toggle dark/light mode</code>
      <div className="flex flex-col flex-gap-2 w-fit p-2">
        <code>current theme - {theme}</code>
        <section className="grid gap-2 grid-cols-4 text-center children:transition-all-200">
          {bgPaletteValues.map((x, i) => (
            <div key={x} className={cx('px-2 border', x, borderPaletteValues[i])}>
              <span className={colorPaletteValues[i]}>
                {x}
                <br />
                {colorPaletteValues[i]}
                <br />
                {borderPaletteValues[i]}
              </span>
              <div
                key={bgHoveredPaletteValues[i]}
                className={cx('px-2 m-2', bgHoveredPaletteValues[i])}
              >
                <span className={cx(colorHoveredPaletteValues[i])}>
                  {bgHoveredPaletteValues[i]} <br />
                  {colorHoveredPaletteValues[i]}
                </span>
              </div>
              <div
                key={partialBorderPalette[i % 4]}
                className={cx(
                  'px-2 m-2',
                  partialBorderPalette[i % 4],
                  borderPaletteValues[i],
                  bgPaletteValues[i]
                )}
              >
                <span className={colorPaletteValues[i]}>{partialBorderPalette[i % 4]}</span>
              </div>
            </div>
          ))}

          {buttonPaletteValues.map((x) => (
            <button key={x} className={x}>
              {x}
            </button>
          ))}

          {Object.keys(cardPalette).map((x) => (
            <div key={x} className={cardPalette[x]}>
              {cardPalette[x]}
              <div className={cx('px-2 m-2', cardHoveredPalette[x])}>{cardHoveredPalette[x]}</div>
            </div>
          ))}
        </section>
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
