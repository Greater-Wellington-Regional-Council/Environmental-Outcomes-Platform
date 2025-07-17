// Generate tests for GWHeader component
import { render, screen } from '@testing-library/react';
import GWHeader from './GWHeader';
import { MemoryRouter } from 'react-router-dom';
import { Councils } from '@lib/councilData';

describe('GWHeader', () => {
  it('renders GWHeader component', () => {
    render(
      <MemoryRouter>
        <GWHeader
          title="Test Title"
          subtitle="Test Subtitle"
          council={Councils.findLast((c) => c.id == 9)!}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });
});
