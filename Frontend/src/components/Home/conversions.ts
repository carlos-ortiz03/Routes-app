export const kilometersToMiles = (kilometers: number): number => {
  return kilometers * 0.621371;
};

export const formatDistance = (distance: number, unit: string): string => {
  // Distance is assumed to be in kilometers
  if (unit === "miles") {
    return `${kilometersToMiles(distance).toFixed(2)} miles`;
  }
  return `${distance.toFixed(2)} km`;
};
