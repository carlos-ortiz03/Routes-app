import { FeatureCollection, LineString, GeoJsonProperties } from "geojson";

export interface GeoJsonRoute
  extends FeatureCollection<LineString, GeoJsonProperties> {
  features: Array<{
    type: "Feature";
    geometry: LineString;
    properties: {
      travelMode: string;
      name: string;
    };
  }>;
}

export interface Route {
  _id: string;
  name: string;
  distance: number;
  geometry: LineString;
  travelMode: string;
  userId?: string;
}

export interface Place {
  id: string;
  place_name: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

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
