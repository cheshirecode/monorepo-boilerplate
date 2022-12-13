import { ComponentMeta, ComponentStory } from '@storybook/react';

import { cardPalette } from '@/styles/palette';

import Card from './';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Card',
  component: Card
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => (
  <article className="flex flex-wrap">
    {Object.keys(cardPalette).map((t) => (
      <div className="w-1/2 p-2" key={t}>
        <Card as="section" title={t} type={t} message="palette" hover shadow {...args} />
      </div>
    ))}
  </article>
);

export const Basic: ComponentStory<typeof Template> = Template.bind({});
Basic.args = {
  message: 'palette',
  hover: true,
  shadow: true,
  className: 'border'
};
export const Objects: ComponentStory<typeof Template> = Template.bind({});

Objects.args = {
  ...Basic.args,
  objects: [
    new TypeError('invalid type'),
    [1, 2, 3],
    {
      foo: 'bar',
      para: 'Bacon ipsum dolor amet eu pork ham sint dolore. Quis andouille turkey, sausage drumstick chislic nisi tempor culpa hamburger non sirloin eu ea ball tip. Fugiat anim consequat, laborum ad in rump. Shoulder in duis est meatball venison sunt. Chislic fugiat short ribs nisi nostrud tail beef shankle corned beef deserunt sunt turkey alcatra occaecat. Tail kevin cow pastrami ex quis excepteur ea, dolore leberkas est nisi t-bone. Ribeye irure turducken, pork loin occaecat consectetur sunt esse nostrud chislic ea salami leberkas ball tip alcatra.'
    },
    'things to turn to JSON strings'
  ]
};
export const Full = Template.bind({});

Full.args = {
  ...Objects.args,
  title: 'title - title',
  message: 'message - Expecting a full description like {"foo": "bar"} in \n one line',
  className: 'border p-4 flex-gap-2 h-auto children:(border border-inherit p-2)',
  children: (
    <p className="">
      custom content with <button className="btn btn-cta"> btn</button>
    </p>
  )
};
