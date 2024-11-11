export interface Country {
    name: string;
    region: string;
    flag: string | null;
    alpha3Code: string;  
  }

  export interface CountryCardProps {
    country: {
      alpha3Code: string;
      name: string;
      region: string;
      flag: string;
    };
}