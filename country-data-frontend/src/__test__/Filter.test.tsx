import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Filter from '../components/Filter';

jest.mock('axios');

describe('Filter Component', () => {
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should render the filter dropdown', () => {
    render(<Filter regions={['Asia', 'Europe', 'Africa']} onRegionChange={jest.fn()} />);
    expect(screen.getByLabelText('Filter by Region')).toBeInTheDocument();
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Africa')).toBeInTheDocument();
  });

  it('should render call onRegionChange and updates state when a region is selected', async () => {
    const onRegionChangeMock = jest.fn();
    render(<Filter regions={['Asia', 'Europe', 'Africa']} onRegionChange={onRegionChangeMock} />);
    mockAxios.onGet('http://localhost:3001/countries/region/Asia').reply(200, [{ name: 'China' }, { name: 'India' }]);
    fireEvent.change(screen.getByLabelText('Filter by Region'), {
      target: { value: 'Asia' },
    });
    await waitFor(() => {
      expect(onRegionChangeMock).toHaveBeenCalledWith([{ name: 'China' }, { name: 'India' }]);
    });
  });

  it('should display an error message when the API call fails', async () => {
    const onRegionChangeMock = jest.fn();
    render(<Filter regions={['Asia', 'Europe', 'Africa']} onRegionChange={onRegionChangeMock} />);
    mockAxios.onGet('http://localhost:3001/countries/region/Asia').reply(500);
    fireEvent.change(screen.getByLabelText('Filter by Region'), {
      target: { value: 'Asia' },
    });
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch regions')).toBeInTheDocument();
    });
  });

  it('should call onRegionChange with an empty array when "All Regions" is selected', async () => {
    const onRegionChangeMock = jest.fn();
    render(<Filter regions={['Asia', 'Europe', 'Africa']} onRegionChange={onRegionChangeMock} />);
    fireEvent.change(screen.getByLabelText('Filter by Region'), {
      target: { value: '' },
    });
    expect(onRegionChangeMock).toHaveBeenCalledWith([]);
  });
});
