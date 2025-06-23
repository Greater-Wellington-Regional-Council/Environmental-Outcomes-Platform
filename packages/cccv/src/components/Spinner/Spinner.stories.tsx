import Spinner from './Spinner'
import {Meta, StoryObj} from "@storybook/react-vite"

const meta = {
    title: "Example/Spinner",
    component: Spinner
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>;

export const SpinnerStory: Story = {
    name: "Default",
    args: {
        size: 24,
        color: "blue",
        onPointerEnterCapture: () => {},
        onPointerLeaveCapture: () => {},
    },
}