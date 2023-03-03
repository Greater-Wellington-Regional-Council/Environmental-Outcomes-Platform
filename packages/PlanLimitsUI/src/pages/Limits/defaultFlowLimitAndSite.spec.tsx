import { render } from '@testing-library/react';
import { expect } from 'vitest';
import defaultFlowLimitsAndSites from './defaultFlowLimitAndSite';

describe('defaultFlowLimitsAndSites', () => {
  it('returns a link when the whaituaId is found', () => {
    const result = defaultFlowLimitsAndSites('1');
    const { getByRole } = render(result);
    const link = getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/.+/)
    );
  });

  it('returns <>None</> when the whaituaId is not found', () => {
    const result = defaultFlowLimitsAndSites('this-id-does-not-exist');
    expect(result).toEqual(<>None</>);
  });
});
