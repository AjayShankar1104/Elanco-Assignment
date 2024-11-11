import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from '../components/Filter';

const mockOnRegionChange = jest.fn();

describe('Filter Component', () => {
  it('renders the correct regions', () => {
    const regions = ['Africa', 'Asia', 'Europe', 'Americas'];
    const selectedRegion = '';
    render(<Filter regions={regions} selectedRegion={selectedRegion} onRegionChange={mockOnRegionChange} />);
    regions.forEach((region) => {
      expect(screen.getByText(region)).toBeInTheDocument();
    });
    expect(screen.getByText('All Regions')).toBeInTheDocument();
  });

  it('should call onRegionChange with the value when a region is selected', () => {
    const regions = ['Africa', 'Asia', 'Europe', 'Americas'];
    const selectedRegion = '';
    render(<Filter regions={regions} selectedRegion={selectedRegion} onRegionChange={mockOnRegionChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Asia' } });
    expect(mockOnRegionChange).toHaveBeenCalledTimes(1);
    expect(mockOnRegionChange).toHaveBeenCalledWith('Asia');
  });

  it('filter countries on selection', () => {
    const regions = ['Africa', 'Asia', 'Europe', 'Americas'];
    const selectedRegion = '';
    render(<Filter regions={regions} selectedRegion={selectedRegion} onRegionChange={mockOnRegionChange} />);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });
});
