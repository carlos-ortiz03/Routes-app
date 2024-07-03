// src/types.ts or src/mapboxTypes.ts

export interface MapboxRoute {
  legs: Array<{
    distance: {
      text: string; // You might need to convert this from meters to a more readable format
      value: number;
    };
    summary?: string;
  }>;
  geometry: {
    coordinates: [number, number][];
  };
  summary: string;
}

export interface Place {
  id: string;
  place_name: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}
