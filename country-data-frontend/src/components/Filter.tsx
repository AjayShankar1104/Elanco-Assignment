
import React from 'react';
import { FilterProps } from '../model/Filter';

const Filter: React.FC<FilterProps> = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">Filter by Region</label>
      <select
        className="border border-gray-300 p-2"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)} 
      >
        <option value="">All Regions</option> 
        {regions.map((region, index) => (
          <option key={index} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
