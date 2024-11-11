
import React from 'react';
import { SearchBarProps } from '../model/Search';

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4">
      <label htmlFor="search" className="block text-gray-700">
        Search for a Country
      </label>
      <input
        id="search"
        type="text"
        placeholder="Enter country name"
        className="border border-gray-300 p-2 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
