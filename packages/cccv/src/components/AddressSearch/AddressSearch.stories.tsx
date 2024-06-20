import { Meta, StoryFn } from '@storybook/react';
import AddressSearch, { AddressSearchProps } from '@components/AddressSearch/AddressSearch';

export default {
  title: 'Components/AddressSearch',
  component: AddressSearch,
} as Meta<typeof AddressSearch>;

const Template: StoryFn<AddressSearchProps> = (args) => <AddressSearch {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Search for address',
  placeholder: 'Search here',
  onSelect: (lv) => console.log(`label: ${lv?.label}, value: ${lv?.value}`),
};