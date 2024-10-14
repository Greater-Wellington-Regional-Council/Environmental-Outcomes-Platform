import FreshwaterManagementUnit from './FreshwaterManagementUnit'
import {render, screen} from '@testing-library/react'
import {describe, expect, vi} from "vitest"
import {MutableRefObject} from "react"
import {FeatureCollection} from 'geojson'

vi.mock('@react-pdf/renderer', async () => {
    return {
        StyleSheet: {
            create: (styles: never) => styles,
        },
        Document: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        Image: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        usePDF: vi.fn().mockReturnValue([
            { document: null }, // UsePDFInstance mock
            vi.fn(), // Mock update function
        ]),
        Font: {
            register: () => {},
        },
    }
})

vi.mock('@lib/useIntersectionObserver', () => {
    return {
        default: (): MutableRefObject<HTMLDivElement | null> => ({current: null}),
    }
})

const emptyFeatureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: []
}

const tangataWhenuaSites: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                location: "TW site 1",
                locationValues: ["a", "b", "c"]
            },
            geometry: {
                type: "Point",
                coordinates: [0, 0],
            },
        },
    ],
}

describe('Spec FreshwaterManagementUnit', function () {
    it('it exists', () => {
        expect(FreshwaterManagementUnit).to.be.ok
    })

    it('shows fmu with catchment description', () => {
        render(<FreshwaterManagementUnit
            freshwaterManagementUnit={{catchmentDescription: "This is a catchment description"}}
            tangataWhenuaSites={emptyFeatureCollection}/>)
        expect(screen.getByText('This is a catchment description')).toBeInTheDocument()
    })

    it('shows fmu with implementation ideas', () => {
        render(<FreshwaterManagementUnit
            freshwaterManagementUnit={{implementationIdeas: "<ul><li>Ideas for implementation</li></ul>"}}
            tangataWhenuaSites={emptyFeatureCollection}/>)
        expect(screen.getByText('Ideas for implementation')).toBeInTheDocument()
    })

    it('shows tangata whenua sites if it exist for the FMU', () => {
        render(<FreshwaterManagementUnit freshwaterManagementUnit={{}} tangataWhenuaSites={tangataWhenuaSites}/>)
        expect(screen.getByText('TW site 1')).toBeInTheDocument()
    })

    it('reveals meta information when About this information clicked', async () => {
        render(<FreshwaterManagementUnit freshwaterManagementUnit={{}} tangataWhenuaSites={emptyFeatureCollection}/>)
        expect(screen.getByText('Contact us for more information')).toBeInTheDocument()
    })
})