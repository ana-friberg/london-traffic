export interface Disruption {
  id: string;
  location: string;
  severity: 'Severe' | 'Moderate' | 'Minor';
  comments: string;
  currentUpdate: string;
  status: 'Active' | 'Inactive';
  geography?: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface FilterState {
  severities: Set<string>;
  searchQuery: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
