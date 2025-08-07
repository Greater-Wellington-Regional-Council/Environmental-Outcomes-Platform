import { Meta, StoryFn } from "@storybook/react-vite";
import InteractiveMap from "./InteractiveMap.tsx";
import { InteractiveMapProps } from "@components/InteractiveMap/lib/InteractiveMap";
import { IMViewLocation } from "@shared/types/global";
import { MapSnapshotProvider } from "@lib/MapSnapshotContext.tsx";

export default {
  title: "Components/InteractiveMap",
  component: InteractiveMap,
} as Meta;

const Template: StoryFn<InteractiveMapProps> = (args) => (
  <MapSnapshotProvider>
    <InteractiveMap {...args} />
  </MapSnapshotProvider>
);

export const Default = {
  render: Template,

  args: {
    startLocation: {
      latitude: -41.2865,
      longitude: 174.7762,
      zoom: 10,
    },
    setLocationInFocus: (location: IMViewLocation) =>
      console.log("Location selected:", location),
    locationInFocus: null,
    children: null,
  },
};
