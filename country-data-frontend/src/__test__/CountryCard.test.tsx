// CountryCard.test.tsx
import { render, screen } from '@testing-library/react';
import CountryCard from '../components/CountryCard';

const mockCountry = {
  alpha3Code: 'IND',
  name: 'India',
  region: 'Asia',
  flag: 'https://flagcdn.com/in.svg',
};

describe('CountryCard Component', () => {
  it('should render country information correctly', () => {
    render(<CountryCard country={mockCountry} />);

   
    expect(screen.getByText('Asia')).toBeInTheDocument();
    const imgElement = screen.getByAltText('Flag of India') as HTMLImageElement;
    expect(imgElement).toBeInTheDocument(); expect(screen.getByText('India')).toBeInTheDocument();
    expect(imgElement.src).toBe(mockCountry.flag);
  });

  it('should render a message when flag is missing', () => {
    const countryWithoutFlag = { ...mockCountry, flag: '' };
    render(<CountryCard country={countryWithoutFlag} />);

    expect(screen.getByText('No Flag Available')).toBeInTheDocument();
  });
});
