import { render, screen } from '@testing-library/react'
import InteractiveMap from "@components/InteractiveMap.tsx";
import {expect} from "vitest";


describe('InteractiveMap component', () => {
    it('it exists', () => {
        expect(InteractiveMap).to.be.ok;
    });

    it('should render', () => {
        render(<InteractiveMap startLocation={{ longitude: 174.7, latitude: -41.3, zoom: 10 }}/>)

        expect(screen.getByTestId('InteractiveMap')).toBeInTheDocument()
    })
})
