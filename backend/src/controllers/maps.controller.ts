import { Request, Response } from "express";
import {
  Client,
  TravelMode,
  DirectionsRoute,
} from "@googlemaps/google-maps-services-js";
import { getWaypoint, LatLng } from "../utils/waypoints";

const client = new Client({});

export const getDirections = async (req: Request, res: Response) => {
  const { origin, destination, mileage, travelMode } = req.query;

  if (!origin || !destination || !mileage || !travelMode) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Ensure that origin and destination are strings
  const originStr = Array.isArray(origin) ? origin[0] : origin;
  const destinationStr = Array.isArray(destination)
    ? destination[0]
    : destination;

  if (typeof originStr !== "string" || typeof destinationStr !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid origin or destination format" });
  }

  try {
    // Convert origin and destination to coordinates if they are not already
    const originCoords = (
      await client.geocode({
        params: {
          address: originStr,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      })
    ).data.results[0].geometry.location;

    const destinationCoords = (
      await client.geocode({
        params: {
          address: destinationStr,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
      })
    ).data.results[0].geometry.location;

    const targetMileage = parseFloat(mileage as string) * 1.60934; // Convert miles to km
    const tolerance = targetMileage * 0.25; // Tolerance of 25%
    const directions = [0, 90, 180, 270]; // North, East, South, West

    console.log(
      `Starting route calculation from ${originCoords.lat},${originCoords.lng} to ${destinationCoords.lat},${destinationCoords.lng} with target mileage ${targetMileage} km and tolerance ${tolerance} km.`
    );

    let bestRoutes: DirectionsRoute[] = [];
    let closestDistance = Infinity;

    for (let maxWaypoints = 1; maxWaypoints <= 3; maxWaypoints++) {
      for (const direction of directions) {
        let increment = 0.05; // Start with 0.05 km
        let distanceMet = false;

        while (!distanceMet) {
          const waypoints: LatLng[] = [];
          for (let i = 0; i < maxWaypoints; i++) {
            waypoints.push(
              getWaypoint(
                {
                  lat: originCoords.lat,
                  lng: originCoords.lng,
                },
                increment,
                direction
              )
            );
            increment += 0.05;
          }

          console.log(
            `Making API call with waypoints: ${waypoints
              .map((point) => `${point.lat},${point.lng}`)
              .join(" | ")}`
          );

          const response = await client.directions({
            params: {
              origin: `${originCoords.lat},${originCoords.lng}`,
              destination: `${destinationCoords.lat},${destinationCoords.lng}`,
              waypoints: waypoints.map((point) => `${point.lat},${point.lng}`),
              mode: travelMode as TravelMode,
              key: process.env.GOOGLE_MAPS_API_KEY!,
            },
            timeout: 10000, // 10 seconds timeout
          });

          if (!response.data.routes.length) {
            console.warn(
              `No routes found for waypoints: ${waypoints
                .map((point) => `${point.lat},${point.lng}`)
                .join(" | ")}`
            );
          } else {
            console.log(
              `Received API response with ${response.data.routes.length} routes.`
            );
            console.log(JSON.stringify(response.data.routes, null, 2));
          }

          const routes = response.data.routes;
          routes.forEach((route) => {
            const totalDistance =
              route.legs.reduce<number>(
                (acc, leg) => acc + (leg.distance?.value ?? 0),
                0
              ) / 1000; // Convert meters to km

            console.log(`Route total distance: ${totalDistance} km`);

            if (Math.abs(totalDistance - targetMileage) < closestDistance) {
              closestDistance = Math.abs(totalDistance - targetMileage);
              bestRoutes.push(route);
            }

            if (totalDistance >= targetMileage + tolerance) {
              distanceMet = true;
            }
          });

          bestRoutes = bestRoutes
            .sort((a, b) => {
              const distanceA =
                a.legs.reduce<number>(
                  (acc, leg) => acc + (leg.distance?.value ?? 0),
                  0
                ) / 1000; // Convert meters to km
              const distanceB =
                b.legs.reduce<number>(
                  (acc, leg) => acc + (leg.distance?.value ?? 0),
                  0
                ) / 1000; // Convert meters to km
              return (
                Math.abs(distanceA - targetMileage) -
                Math.abs(distanceB - targetMileage)
              );
            })
            .slice(0, 10); // Get the top 10 routes

          if (distanceMet) {
            console.log(
              `Distance met for direction ${direction} with max waypoints ${maxWaypoints}`
            );
            break;
          }
        }
      }
    }

    res.json({ routes: bestRoutes });
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch directions" });
  }
};
