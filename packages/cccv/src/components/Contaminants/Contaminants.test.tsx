import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Contaminants} from './Contaminants.tsx';

const contaminants = [
  { title: 'Contaminant 1', base: 'Base 1', objective: 'Objective 1', byWhen: 'Date 1' },
  { title: 'Contaminant 2', base: 'Base 2', objective: 'Objective 2', byWhen: 'Date 2' },
  { title: 'Contaminant 3', base: 'Base 3', objective: 'Objective 3', byWhen: 'Date 3' },
];

describe('ContaminantsTable', () => {
  it('renders the correct number of rows and columns', () => {
    render(<Contaminants contaminants={contaminants} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);

    const columns = screen.getAllByRole('columnheader');
    expect(columns).toHaveLength(4);

    const topLeftCell = screen.getByText(contaminants[0].title);
    expect(topLeftCell).toBeInTheDocument();

    const bottomRightCell = screen.getByText(contaminants[contaminants.length - 1].byWhen);
    expect(bottomRightCell).toBeInTheDocument();
  });
});
