import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';
import type { MouseEvent } from 'react';

import { colors, sources } from '@/styles/tokens';

type ColorsProps = BaseProps & { filters: Record<string, string | string[]> };

const createOnClick = (v: string) => async (_e: MouseEvent) => {
  // localhost - open chrome://flags/ in Chrome and add origin to "Insecure origins treated as secure"
  await navigator?.clipboard?.writeText(v);
};

const Colors = ({ className, filters, ...props }: ColorsProps) => (
  <article
    {...props}
    className={cx(
      'responsive-page responsive-padding w-full',
      'grid',
      'lt-xs:grid-cols-1',
      'grid-cols-2',
      'md:grid-cols-3',
      'children:(relative border-size-[0.5px] border-solid border-gray-300)',
      className
    )}
  >
    {Object.keys(colors).map((name) => {
      let colorCodes = colors[name];
      if (typeof colorCodes === 'string') {
        colorCodes = { [name]: colorCodes };
      }
      const filtered = {};
      Object.keys(colorCodes).forEach((c) => {
        const hex = colorCodes[c];
        const colorCode = name !== c ? `${name}-${c}` : name;
        const bgClassName = `bg-${colorCode}`;
        const sourcesFilter = filters.source;
        if (
          !sourcesFilter ||
          sourcesFilter
            .split(',')
            .some(
              (x) => sources[colorCode] === x || (x[0] === '!' && sources[colorCode] !== x.slice(1))
            )
        ) {
          filtered[colorCode] = {
            hex,
            bgClassName
          };
        }
      });
      if (Object.keys(filtered).length === 0) {
        return null;
      }
      return (
        <article key={name} className="text-center">
          <header className="font-gs-display03">{name}</header>
          <div className="grid grid-cols-2 md:grid-cols-3 text-h6">
            {Object.keys(filtered).map((colorCode) => {
              const { hex, bgClassName } = filtered[colorCode];

              return (
                <div
                  key={bgClassName}
                  className={cx(
                    '--poc-color-palette',
                    'flex flex-col',
                    'children:(border-size-1 border-transparent)'
                  )}
                  style={{
                    backgroundColor: hex
                  }}
                >
                  <button
                    className="@hover:(border-indigo-400 cursor-pointer)"
                    onClick={createOnClick(hex)}
                  >
                    {hex}
                  </button>
                  <button
                    className="@hover:(border-indigo-400 cursor-pointer)"
                    onClick={createOnClick(bgClassName)}
                  >
                    {bgClassName}
                  </button>
                  <sub className="min-h-2">{sources[colorCode]}</sub>
                </div>
              );
            })}
          </div>
        </article>
      );
    })}
  </article>
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'styles/Colors',
  component: Colors
} as ComponentMeta<typeof Colors>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Colors> = (args) => <Colors {...args} />;

export const All = Template.bind({});

All.args = {
  filters: {}
};
