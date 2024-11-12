
import React, { useState } from 'react';
import axios from 'axios';
import { FilterProps } from '../model/Filter';


const Filter: React.FC<FilterProps> = ({ regions, onRegionChange }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRegions = async (region: string) => {
    let url = region === '' ? 'http://localhost:3001/countries/' : `http://localhost:3001/countries/region/${region}`;
    setLoading(true);
    try {
      const response = await axios.get(url); 
      setSelectedRegion(region);
      onRegionChange(response.data);  
    } catch (err) {
      setError('Failed to fetch regions');
    } finally {
      setLoading(false);
    }
  };  

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = event.target.value;
    fetchRegions(newRegion)
   
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mb-4">
      <label htmlFor="region-filter" className="block text-gray-700">Filter by Region</label>
      <select
        id="region-filter"
        className="border border-gray-300 p-2"
        value={selectedRegion}
        onChange={handleRegionChange}  
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
