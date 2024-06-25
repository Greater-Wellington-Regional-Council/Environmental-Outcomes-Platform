import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {describe, it, expect} from 'vitest';
import {Contaminants} from './Contaminants.tsx';
import {userEvent} from "@storybook/test";

const contaminants = [
  {title: 'Nitrogen', base: 'A', objective: 'B', byWhen: '2040 (2080 for MCI)'},
  {title: 'Periphyton', base: 'A', objective: 'A then B', byWhen: '2040 (2080 for MCI)'},
  {title: 'Ammonia', base: 'B', objective: 'Top of B', byWhen: '2040'},
  {title: 'Ammonia', base: 'B', objective: 'C', byWhen: 'Maintain'},
];

describe('ContaminantsTable', () => {
  it('renders the correct number of rows and columns', async () => {
    render(<Contaminants contaminants={contaminants}/>);

    const testIdPairs: [string, number][] = [
      ['contaminant-expander', 4],
      ['contaminant-title', 4],
      ['contaminant-base', 4],
      ['contaminant-objective', 4],
      ['contaminant-base-desc', 0],
      ['contaminant-objective-desc', 0],
    ];

    testIdPairs.forEach(([testId, expectedLength]) => {
      const elements = screen.queryAllByTestId(testId);
      expect(elements, `Contaminant ${testId} failed: expected ${expectedLength}`).toHaveLength(expectedLength);
    });

    const expanders = screen.getAllByTestId("contaminant-expander");
    userEvent.click(expanders[0]);

    await waitFor(() => {
      expect(screen.getByTestId('contaminant-base-desc')).toBeInTheDocument();
      expect(screen.getByTestId('contaminant-objective-desc')).toBeInTheDocument();
    })
  });
});
