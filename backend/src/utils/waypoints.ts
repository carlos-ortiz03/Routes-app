import { computeDestinationPoint } from "geolib";

export interface LatLng {
  lat: number;
  lng: number;
}

const directions = [0, 90, 180, 270]; // North, East, South, West

export const getWaypoint = (
  origin: LatLng,
  increment: number,
  direction: number
): LatLng => {
  const waypoint = computeDestinationPoint(
    origin,
    increment * 1000, // Convert to meters
    direction
  );
  return { lat: waypoint.latitude, lng: waypoint.longitude };
};
