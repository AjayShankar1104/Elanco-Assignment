
export interface Country {
  name: string | CountryCommon; 
  flag: string;
  region: string;
  population?: number;
  languages?: string[];
  currency?: string[];
  capital?: string[];
  timezones?: string[]; 
}

export interface CountrySearch {
  name?: string;
  capital?: string;
  region?: string;
  timezone?: string;
}

export interface CountryCommon {
  common: string;
}


