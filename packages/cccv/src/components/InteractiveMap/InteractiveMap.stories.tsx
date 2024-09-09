import { Meta, StoryFn } from '@storybook/react'
import InteractiveMap from "./InteractiveMap.tsx"
import {InteractiveMapProps} from "@components/InteractiveMap/lib/InteractiveMap"

export default {
    title: 'Components/InteractiveMap',
    component: InteractiveMap,
} as Meta

const Template: StoryFn<InteractiveMapProps> = (args) => <InteractiveMap {...args} />

export const Default = Template.bind({})
Default.args = {
    startLocation: {
        latitude: -41.2865,  // Wellington, NZ coordinates
        longitude: 174.7762,
        zoom: 10,
    },
    select: (location) => console.log('Location selected:', location),
    selected: null,
    children: null,
}