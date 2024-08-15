import { Meta, StoryFn } from '@storybook/react';
import Disclaimer from '../Disclaimer'; // Adjust the import path as needed

export default {
  title: 'Components/Disclaimer',
  component: Disclaimer,
} as Meta;

const Template: StoryFn = (args) => <Disclaimer {...args} />;

export const Default = Template.bind({});
Default.args = {};

// To ensure the story always shows the disclaimer (even if previously agreed to),
// you can reset the localStorage before each story rendering
Default.decorators = [
  (Story) => {
    localStorage.removeItem('disclaimer-agreed');
    return <Story />;
  },
];
