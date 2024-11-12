export interface ApiResponse {
    name: {
      common: string;
    };
    flags: {
      svg: string;
    };
    region: string;
    languages: Record<string, string>; 
    currencies: Record<string, { name: string }>;  
    population: number;
}