import { useState, useEffect } from 'react';
import axios from 'axios';
import { Country } from '../model/country';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3001/countries');
        setCountries(response.data);
        const uniqueRegions = [
          ...new Set(response.data.map((country: Country) => country.region)),
        ];
        setRegions(uniqueRegions as string[]);

        setLoading(false);
      } catch (err) {
        setError('Failed to load countries');
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredCountries = countries.filter((country) => {
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });


  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };
  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>

      <div className="mb-4">
      <Filter
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
      />
      </div>

      {/* Display filtered countries */}
      <div className="grid grid-cols-4">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country: Country) => (
            <CountryCard key={country.name} country={country} />
          ))
        ) : (
          <p className="text-gray-500">No countries found.</p>
        )}
      </div>
    </div>
  );
};
