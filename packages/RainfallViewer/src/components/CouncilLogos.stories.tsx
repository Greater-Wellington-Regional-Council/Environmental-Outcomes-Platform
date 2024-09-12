import CouncilLogos from "./CouncilLogos";
import {Meta, StoryObj} from "@storybook/react";

const meta = {
    title: "RainfallViewer/CouncilLogos",
    component: CouncilLogos
} satisfies Meta<typeof CouncilLogos>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CouncilLogosStory: Story = {
    name: "Default",
    args: {
        highlightCouncil: (councilId: number) => {
            console.log(councilId);
        }
    }
};
