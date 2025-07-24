import Spinner from "./Spinner";
import { Meta } from "@storybook/react-vite";

export default {
  title: "Example/Spinner",
  component: Spinner,
} as Meta<typeof Spinner>;

export const Default = {
  args: {
    size: 24,
    color: "blue",
    onPointerEnterCapture: () => { },
    onPointerLeaveCapture: () => { },
  },
};
