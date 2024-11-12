
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';
import { SetStateAction } from 'react';

describe('SearchBar Component', () => {
  it('should render the search input correctly', () => {
    render(<SearchBar searchTerm={''} setSearchTerm={function (value: SetStateAction<string>): void {
        throw new Error('Function not implemented.');
    } } />);

    const inputElement = screen.getByPlaceholderText('Enter country name');
    expect(inputElement).toBeInTheDocument();
  });

  it('should allows users to type in the search input', () => {
    render(<SearchBar searchTerm={''} setSearchTerm={function (value: SetStateAction<string>): void {
        throw new Error('Function not implemented.');
    } } />);

    const inputElement = screen.getByPlaceholderText('Enter country name') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'India' } });

    expect(inputElement.value).toBe('India');
  });
});
