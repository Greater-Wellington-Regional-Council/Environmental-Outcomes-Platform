import FreshwaterManagementUnit from './FreshwaterManagementUnit.tsx';
import { render, screen } from '@testing-library/react'
import {expect} from "vitest";

describe('Spec FreshwaterManagementUnit', function () {
    it('it exists', () => {
        expect(FreshwaterManagementUnit).to.be.ok;
    });
});

describe('Catchment description', function () {
  it('shows catchment description if it exists for the FMU', () => {
    render(<FreshwaterManagementUnit catchmentDescription="This is a catchment description"  id={123}/>)
    expect(screen.getByTestId('catchment-description')).toBeInTheDocument()
  })
})