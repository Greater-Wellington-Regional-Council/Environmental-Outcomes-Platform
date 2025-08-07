import { Meta } from "@storybook/react-vite";
import AddressSearch from "@components/AddressSearch/AddressSearch";
import { LabelAndValue } from "@src/elements/ComboBox/ComboBox";

export default {
  title: "Components/AddressSearch",
  component: AddressSearch,
} as Meta<typeof AddressSearch>;

export const Default = {
  args: {
    label: "Search for address",
    placeholder: "Search here",
    onSelect: (lv: LabelAndValue) => console.log(`label: ${lv?.label}, value: ${lv?.value}`, lv),
  },
};
