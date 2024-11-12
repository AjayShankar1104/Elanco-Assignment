import { Request, Response } from 'express';
import axios from 'axios';
import { Country, CountrySearch } from '../models/country.model';
import { ApiResponse } from '../models/api-response.model';

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all';

// Get all countries
export const getCountries = async (req: Request, res: Response) => {
  try {
    const response = await axios.get<ApiResponse[]>(REST_COUNTRIES_API);
    const countries: Country[] = response.data.map((country) => ({
      name: country.name.common,
      flag: country.flags.svg,
      region: country.region,
    }));
    res.json(countries);
  } catch (error) {
    console.error('Error getting countries:', error);
    res.status(500).json({ message: 'Error getting countries' });
  }
};

// Get country by code
export const getCountryByCode = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  try {
    const response = await axios.get<ApiResponse[]>(`https://restcountries.com/v3.1/alpha/${code}`);
    const country = response.data[0];

    if (!country) {
       res.status(404).json({ message: 'Country not found' });
       return;
    }

    const countryFields: Country = {
      name: country.name.common,
      flag: country.flags.svg,
      population: country.population,
      languages: country.languages ? Object.values(country.languages) : [],
      region: country.region,
      currency: country.currencies ? Object.values(country.currencies).map((currency) => currency.name) : [],
    };
    res.json(countryFields);
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ message: 'Error fetching country data' });
  }
};

// Filter countries by region

export const filterCountriesByRegion = async (req: Request, res: Response): Promise<void> => {
  const { region } = req.params;

  try {
    const response = await axios.get<ApiResponse[]>(REST_COUNTRIES_API);
    const filteredCountries = response.data.filter((country) => country.region.toLowerCase() === region.toLowerCase());
    if (filteredCountries.length === 0) {
      res.status(404).json({ message: `No countries found for region: ${region}` });
      return;
    }

    const countries = filteredCountries.map((country) => ({
      name: country.name.common,
      flag: country.flags.svg,
      population: country.population,
      region: country.region,
      languages: country.languages ? Object.values(country.languages) : [],
      currency: country.currencies ? Object.values(country.currencies).map((currency) => currency.name) : [],
    }));

    res.json(countries);
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ message: 'Error fetching country data' });
  }
};

// Search countries
  
export const searchCountries = async (req: Request<{}, {}, {}, CountrySearch>, res: Response): Promise<void> => {
  const { name, capital, region, timezone } = req.query;

  try {
    const response = await axios.get<Country[]>(REST_COUNTRIES_API);
    let countries = response.data;

    if (name) {
      countries = countries.filter((country) => {
        const countryName = typeof country.name === 'string' ? country.name : country.name.common;
        return countryName.toLowerCase().includes(name.toLowerCase());
      });
    }

    if (capital) {
      countries = countries.filter((country) =>
        country.capital && country.capital[0].toLowerCase().includes(capital.toLowerCase())
      );
    }

    if (region) {
      countries = countries.filter((country) => country.region.toLowerCase() === region.toLowerCase());
    }

    if (timezone) {
      countries = countries.filter((country) => country.timezones?.includes(timezone)); 
    }

    if (countries.length === 0) {
      res.status(404).json({ message: 'No countries found matching the search criteria' });
      return;
    }

    res.json(countries);
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ message: 'Error fetching country data' });
  }
};

