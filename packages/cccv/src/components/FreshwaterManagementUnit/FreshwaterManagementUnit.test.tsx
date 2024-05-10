import FreshwaterManagementUnit from './FreshwaterManagementUnit.tsx';
import { render, screen } from '@testing-library/react'
import {expect} from "vitest";

describe('Spec FreshwaterManagementUnit', function () {
    it('it exists', () => {
        expect(FreshwaterManagementUnit).to.be.ok;
    });

  it('shows fmu with catchment description', () => {
    render(<FreshwaterManagementUnit freshwaterManagementUnit={{ catchmentDescription: "This is a catchment description" }} tangataWhenuaSites={[]} />)
    expect(screen.getByTestId('catchment-description')).toBeInTheDocument()
  })

  it('shows tangata whenua sites if it exists for the FMU', () => {
    render(<FreshwaterManagementUnit freshwaterManagementUnit={{}} tangataWhenuaSites={[{ location: "TW site 1" }]} />)
    expect(screen.getByText('TW site 1')).toBeInTheDocument()
  })
})