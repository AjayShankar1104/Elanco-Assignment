import { Country } from "./country";

export interface FilterProps {
    onRegionChange: (countries: Country[]) => void;
    regions: string[]
  }