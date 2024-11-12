import { Request, Response } from 'express';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';
import { getCountries, getCountryByCode, filterCountriesByRegion, searchCountries } from '../controllers/countryController';
import { afterEach, describe, it } from 'node:test';

// Set up the axios mock adapter
const axiosMock = new mockAxios(axios);

describe('Country Controller', () => {
  afterEach(() => {
    // Reset the mock after each test
    axiosMock.reset();
  });

  // Test for getCountries function
  describe('getCountries', () => {
    it('should return a list of countries', async () => {
      axiosMock.onGet('https://restcountries.com/v3.1/all').reply(200, [
        { name: { common: 'India' }, flags: { svg: 'india-flag.svg' }, region: 'Asia' },
        { name: { common: 'Brazil' }, flags: { svg: 'brazil-flag.svg' }, region: 'Americas' },
      ]);

      const req = {} as Request;
      const res = { json: jest.fn() } as unknown as Response;

      await getCountries(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { name: 'India', flag: 'india-flag.svg', region: 'Asia' },
        { name: 'Brazil', flag: 'brazil-flag.svg', region: 'Americas' },
      ]);
    });

    it('should return 500 if there is an error fetching countries', async () => {
      axiosMock.onGet('https://restcountries.com/v3.1/all').reply(500);

      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await getCountries(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error getting countries' });
    });
  });

  // Test for getCountryByCode function
  describe('getCountryByCode', () => {
    it('should return country details by code', async () => {
      const countryData = {
        name: { common: 'India' },
        flags: { svg: 'india-flag.svg' },
        population: 1366417754,
        languages: { hi: 'Hindi', en: 'English' },
        region: 'Asia',
        currencies: { INR: { name: 'Indian Rupee' } },
      };

      axiosMock.onGet('https://restcountries.com/v3.1/alpha/in').reply(200, [countryData]);

      const req = { params: { code: 'in' } } as unknown as Request;
      const res = { json: jest.fn() } as unknown as Response;

      await getCountryByCode(req, res);

      expect(res.json).toHaveBeenCalledWith({
        name: 'India',
        flag: 'india-flag.svg',
        population: 1366417754,
        languages: ['Hindi', 'English'],
        region: 'Asia',
        currency: ['Indian Rupee'],
      });
    });

    it('should return 404 if country not found', async () => {
      axiosMock.onGet('https://restcountries.com/v3.1/alpha/xyz').reply(404);

      const req = { params: { code: 'xyz' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await getCountryByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Country not found' });
    });
  });

  // Test for filterCountriesByRegion function
  describe('filterCountriesByRegion', () => {
    it('should return countries for the given region', async () => {
      const countryData = [
        { name: { common: 'India' }, flags: { svg: 'india-flag.svg' }, region: 'Asia' },
        { name: { common: 'Brazil' }, flags: { svg: 'brazil-flag.svg' }, region: 'Americas' },
      ];

      axiosMock.onGet('https://restcountries.com/v3.1/all').reply(200, countryData);

      const req = { params: { region: 'Asia' } } as unknown as Request;
      const res = { json: jest.fn() } as unknown as Response;

      await filterCountriesByRegion(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { name: 'India', flag: 'india-flag.svg', region: 'Asia' },
      ]);
    });

    it('should return 404 if no countries found for the region', async () => {
      const countryData = [
        { name: { common: 'India' }, flags: { svg: 'india-flag.svg' }, region: 'Asia' },
      ];

      axiosMock.onGet('https://restcountries.com/v3.1/all').reply(200, countryData);

      const req = { params: { region: 'Europe' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await filterCountriesByRegion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No countries found for region: Europe' });
    });
  });

  // Test for searchCountries function
  describe('searchCountries', () => {
    it('should return countries filtered by query parameters', async () => {
      const countryData = [
        { name: { common: 'India' }, capital: ['New Delhi'], region: 'Asia', timezones: ['UTC+05:30'], flags: { svg: 'india-flag.svg' } },
        { name: { common: 'Brazil' }, capital: ['Brasília'], region: 'Americas', timezones: ['UTC-03:00'], flags: { svg: 'brazil-flag.svg' } },
      ];

      axiosMock.onGet('https://restcountries.com/v3.1/all').reply(200, countryData);

      const req = { query: { name: 'India' } } as unknown as Request;
      const res = { json: jest.fn() } as unknown as Response;

      await searchCountries(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { name: 'India', flag: 'india-flag.svg', region: 'Asia', capital: ['New Delhi'], timezones: ['UTC+05:30'] },
      ]);
    });

    it('should return 404 if no countries match the search criteria', async () => {
      const countryData = [
        { name: { common: 'India' }, capital: ['New Delhi'], region: 'Asia', timezones: ['UTC+05:30'], flags: { svg: 'india-flag.svg' } },
      ];

      axiosMock.onGet('https://restcountries.com/v3.1/all').reply(200, countryData);

      const req = { query: { name: 'NonExistentCountry' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await searchCountries(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No countries found matching the search criteria' });
    });
  });
});
