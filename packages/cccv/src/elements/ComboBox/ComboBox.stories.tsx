import { Meta, StoryFn } from '@storybook/react'
import ComboBox, { ComboBoxProps } from './ComboBox'

export default {
  title: 'Components/ComboBox',
  component: ComboBox,
} as Meta<typeof ComboBox>

const Template: StoryFn<ComboBoxProps> = (args) => <ComboBox {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Search for address',
  placeholder: 'Search here',
  options: [
    { label: '123 Main St', value: '123 Main St' },
    { label: '456 Elm St', value: '456 Elm St' },
    { label: '789 Oak St', value: '789 Oak St' },
  ],
  onSelect: (lv) => console.log('Selected:', lv?.label, lv?.value),
}
