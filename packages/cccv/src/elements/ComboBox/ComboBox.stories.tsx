import { Meta, StoryFn } from '@storybook/react';
import ComboBox, { ComboBoxProps } from '@elements/ComboBox/ComboBox';

export default {
  title: 'Components/ComboBox',
  component: ComboBox,
} as Meta<typeof ComboBox>;

const Template: StoryFn<ComboBoxProps> = (args) => <ComboBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Search for address',
  placeholder: 'Search here',
  options: ['123 Main St', '456 Elm St', '789 Oak St'],
  onSelect: (value: string) => console.log('Selected:', value),
};
//
// export const Upwards = Template.bind({});
// Upwards.args = {
//   label: 'Search for address',
//   placeholder: 'Search here',
//   options: ['123 Main St', '456 Elm St', '789 Oak St'],
//   onSelect: (value: string) => console.log('Selected:', value),
//   directionUp: true,
//   className: 'absolute bottom-4',
// };