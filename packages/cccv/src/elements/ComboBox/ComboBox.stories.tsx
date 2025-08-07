import { Meta } from "@storybook/react-vite";
import ComboBox, { LabelAndValue } from "./ComboBox";

export default {
  title: "Components/ComboBox",
  component: ComboBox,
} as Meta<typeof ComboBox>;

export const Default = {
  args: {
    label: "Search for address",
    placeholder: "Search here",
    options: [
      { label: "123 Main St", value: "123 Main St" },
      { label: "456 Elm St", value: "456 Elm St" },
      { label: "789 Oak St", value: "789 Oak St" },
    ],
    onSelect: (lv: LabelAndValue) => console.log("Selected:", lv?.label, lv?.value, lv),
  },
};
