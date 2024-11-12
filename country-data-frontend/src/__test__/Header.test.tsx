
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  it('should render header with correct title', () => {
    render(<Header />);

    expect(screen.getByText('Country Finder')).toBeInTheDocument();
  });
});
