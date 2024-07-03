import { Request, Response } from "express";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const directionsClient = mbxDirections({
  accessToken: process.env.MAPBOX_API_KEY!,
});
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAPBOX_API_KEY!,
});

const mapTravelMode = (
  mode: string
): "walking" | "cycling" | "driving" | "driving-traffic" => {
  switch (mode) {
    case "walking":
      return "walking";
    case "bicycling":
      return "cycling";
    case "driving":
      return "driving";
    case "transit":
      return "driving"; // Mapbox does not have a direct "transit" mode, using "driving" as fallback
    default:
      return "walking"; // Default fallback mode
  }
};

export const getDirections = async (req: Request, res: Response) => {
  const { origin, mileage, travelMode } = req.query;

  if (!origin || !mileage || !travelMode) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const geocodeResponse = await geocodingClient
      .forwardGeocode({
        query: origin as string,
        limit: 1,
      })
      .send();

    if (!geocodeResponse.body.features.length) {
      return res.status(400).json({ error: "Invalid origin address" });
    }

    const [longitude, latitude] =
      geocodeResponse.body.features[0].geometry.coordinates;
    const targetDistance = parseFloat(mileage as string) * 1000; // Convert km to meters

    const routeRequests = [];

    const mapboxProfile = mapTravelMode(travelMode as string);

    for (let i = 0; i < 10; i++) {
      routeRequests.push(
        directionsClient
          .getDirections({
            profile: mapboxProfile,
            waypoints: [
              { coordinates: [longitude, latitude] },
              {
                coordinates: [
                  longitude + Math.random() * 0.01 - 0.005,
                  latitude + Math.random() * 0.01 - 0.005,
                ],
              },
              { coordinates: [longitude, latitude] }, // Loop back to the same point
            ],
            steps: true,
            geometries: "geojson",
            overview: "full",
          })
          .send()
      );
    }

    const responses = await Promise.all(routeRequests);
    let routes = responses.map((response) => response.body.routes).flat();

    // Sort routes by the closest distance to the targetDistance
    routes.sort((a, b) => {
      const diffA = Math.abs(a.distance - targetDistance);
      const diffB = Math.abs(b.distance - targetDistance);
      return diffA - diffB;
    });

    // Add distance property if it's missing
    routes = routes.map((route) => {
      if (!route.distance) {
        route.distance = route.legs.reduce(
          (acc: number, leg: any) => acc + leg.distance,
          0
        );
      }
      return route;
    });

    res.json({ routes });
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch directions" });
  }
};
