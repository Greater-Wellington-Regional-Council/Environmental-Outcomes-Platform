import { expect } from 'vitest';
import { Screen, queries, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Disclaimer, { saveDisclaimerAgreed } from './index';

function queryDisclaimerDialog(screenToQuery: Screen<typeof queries>) {
  return screenToQuery.queryByRole('dialog', {
    name: /natural resource plan limits/i,
  });
}

describe('Disclaimer', () => {
  it('should render', () => {
    render(<Disclaimer />);

    expect(queryDisclaimerDialog(screen)).toBeInTheDocument();
  });

  it('should close if agreed to', async () => {
    const user = userEvent.setup();
    render(<Disclaimer />);

    const agreeButton = screen.getByRole('button', { name: /agree/i });
    await user.click(agreeButton);

    expect(queryDisclaimerDialog(screen)).not.toBeInTheDocument();
  });

  it('should not show of previously agreed to', async () => {
    const user = userEvent.setup();
    saveDisclaimerAgreed();
    render(<Disclaimer />);
    expect(queryDisclaimerDialog(screen)).not.toBeInTheDocument();
  });
});
