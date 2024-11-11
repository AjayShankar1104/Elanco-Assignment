
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders header with correct title', () => {
    render(<Header />);

    expect(screen.getByText('Country Finder')).toBeInTheDocument();
  });
});
