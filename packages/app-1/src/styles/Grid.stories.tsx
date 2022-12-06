import { ComponentMeta, ComponentStory } from '@storybook/react';
import cx from 'classnames';

const Sample = ({ className, desc, ...props }: BaseProps & { desc: string }) => (
  <section>
    <pre className="p-4">{desc}</pre>
    <section
      className={cx('children:(bg-amber) text-black shadow-lg w-full h-full', className)}
      {...props}
    >
      {Array(20)
        .fill(0)
        .map((_x, i) => (
          <div key={i} className="border border-light">
            {i}
          </div>
        ))}
    </section>
  </section>
);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'styles/Grid',
  component: Sample,
  args: {}
} as ComponentMeta<typeof Sample>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Sample> = (args) => <Sample {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const GridFiller = Template.bind({});
GridFiller.args = {
  desc: '1 liner of grid with 2.5rem per item, ',
  className: 'grid grid-cols-fill-10'
};

export const GridColMax = Template.bind({});
GridColMax.args = {
  desc: 'grid with max(2.5rem, 25%) per item',
  className: 'grid grid-cols-max-10-4'
};

export const GridColMin = Template.bind({});
GridColMin.args = {
  desc: 'grid with min(2.5rem, 25%) per item',
  className: 'grid grid-cols-min-10-4'
};

export const GridColFluid = Template.bind({});
GridColFluid.args = {
  desc: 'grid with min. 15rem width per item but no more than 25%',
  className: 'grid grid-cols-fluid-60-4'
};

export const ResponsiveGrid = Template.bind({});
ResponsiveGrid.args = {
  desc: 'resize viewport for responsiveness',
  className: 'responsive-grid'
};

export const ResponsiveMinGrid = Template.bind({});
ResponsiveMinGrid.args = {
  desc: 'resize viewport for responsiveness, min 20rem per item',
  className: 'responsive-grid-min-80'
};

export const ResponsiveMaxGrid = Template.bind({});
ResponsiveMaxGrid.args = {
  desc: 'resize viewport for responsiveness, max 20rem per item',
  className: 'responsive-grid-max-80'
};

export const ResponsiveFluidGrid = Template.bind({});
ResponsiveFluidGrid.args = {
  desc: 'resize viewport for responsiveness, (20rem...desirable %) per item',
  className: 'responsive-grid-fluid-80'
};
