import FreshwaterManagementUnit from './FreshwaterManagementUnit.tsx';
import {render, screen} from '@testing-library/react'
import {describe, expect, vi} from "vitest";
import {MutableRefObject} from "react";

vi.mock('@react-pdf/renderer', async () => {
  return {
    PDFDownloadLink: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    StyleSheet: {
      create: (styles: never) => styles,
    },
    Document: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Image: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Font: {
      register: () => {},
    },
  };
});

vi.mock('@lib/useIntersectionObserver', () => {
  return {
    default: (): MutableRefObject<HTMLDivElement | null> => ({ current: null }),
  };
});

describe('Spec FreshwaterManagementUnit', function () {
    it('it exists', () => {
        expect(FreshwaterManagementUnit).to.be.ok;
    });

  it('shows fmu with catchment description', () => {
    render(<FreshwaterManagementUnit freshwaterManagementUnit={{ catchmentDescription: "This is a catchment description" }} tangataWhenuaSites={[]} />)
    expect(screen.getByText('This is a catchment description')).toBeInTheDocument()
  })

  it('shows fmu with implementation ideas', () => {
    render(<FreshwaterManagementUnit freshwaterManagementUnit={{ implementationIdeas: "Ideas for implementation" }} tangataWhenuaSites={[]} />)
    expect(screen.getByText('Ideas for implementation')).toBeInTheDocument()
  })

  it('shows tangata whenua sites if it exists for the FMU', () => {
    render(<FreshwaterManagementUnit freshwaterManagementUnit={{}} tangataWhenuaSites={[{ location: "TW site 1" }]} />)
    expect(screen.getByText('TW site 1')).toBeInTheDocument()
  })

  it('reveals meta information when About this information clicked', async () => {
    render(<FreshwaterManagementUnit freshwaterManagementUnit={{}} tangataWhenuaSites={[]} />);
    expect(screen.getByText('Contact us for more information')).toBeInTheDocument();
  });
})
