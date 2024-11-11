export interface FilterProps {
    regions: string[];
    selectedRegion: string;
    onRegionChange: (region: string) => void;
  }