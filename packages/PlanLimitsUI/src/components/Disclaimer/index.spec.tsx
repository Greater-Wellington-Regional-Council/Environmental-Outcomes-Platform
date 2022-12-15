import { expect } from 'vitest';
import { Screen, queries, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Disclaimer, { saveDisclaimerAgreed } from './index';

function getDisclaimer(screen: Screen<typeof queries>) {
  return screen.queryByRole('dialog', {
    name: /plan limits viewer/i,
  });
}

describe('Disclaimer', () => {
  it('should render', () => {
    render(<Disclaimer />);

    expect(getDisclaimer(screen)).toBeInTheDocument();
  });

  it('should close if agreed to', async () => {
    const user = userEvent.setup();
    render(<Disclaimer />);

    const agreeButton = screen.getByRole('button', { name: /agree/i });
    await user.click(agreeButton);

    expect(getDisclaimer(screen)).not.toBeInTheDocument();
  });

  it('should not show of previously agreed to', async () => {
    const user = userEvent.setup();
    saveDisclaimerAgreed();
    render(<Disclaimer />);
    expect(getDisclaimer(screen)).not.toBeInTheDocument();
  });
});
