import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { vi } from 'vitest';
import Home from '../pages';

vi.mock('axios');

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading message when fetching data', () => {
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message if fetching data fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to load countries'));
    render(<Home />);
    await waitFor(() => expect(screen.getByText('Failed to load countries')).toBeInTheDocument());
  });

  it('renders country cards once data is fetched', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { name: 'India', region: 'Asia', flag: 'https://flagcdn.com/in.svg', alpha3Code: 'IND' },
        { name: 'USA', region: 'Americas', flag: 'https://flagcdn.com/us.svg', alpha3Code: 'USA' },
      ],
    });

    render(<Home />);
    await waitFor(() => expect(screen.getByText('India')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('USA')).toBeInTheDocument());
  });

  it('filters countries based on the search term', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { name: 'India', region: 'Asia', flag: 'https://flagcdn.com/in.svg', alpha3Code: 'IND' },
        { name: 'USA', region: 'Americas', flag: 'https://flagcdn.com/us.svg', alpha3Code: 'USA' },
      ],
    });

    render(<Home />);
    await waitFor(() => expect(screen.getByText('India')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('USA')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Enter country name'), {
      target: { value: 'India' },
    });
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.queryByText('USA')).not.toBeInTheDocument();
  });
});
