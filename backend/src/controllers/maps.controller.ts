import { Request, Response } from "express";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { DirectionsWaypoint } from "@mapbox/mapbox-sdk/services/directions";

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
    console.error("Missing required parameters:", {
      origin,
      mileage,
      travelMode,
    });
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    console.log("Geocoding origin:", origin);
    const geocodeResponse = await geocodingClient
      .forwardGeocode({
        query: origin as string,
        limit: 1,
      })
      .send();

    if (!geocodeResponse.body.features.length) {
      console.error("Invalid origin address:", origin);
      return res.status(400).json({ error: "Invalid origin address" });
    }

    const [longitude, latitude] =
      geocodeResponse.body.features[0].geometry.coordinates;
    console.log("Geocoded coordinates:", { longitude, latitude });

    const targetDistance = parseFloat(mileage as string) * 1000; // Convert km to meters
    const mapboxProfile = mapTravelMode(travelMode as string);

    console.log("Generating routes with parameters:", {
      longitude,
      latitude,
      targetDistance,
      mapboxProfile,
    });

    // Function to create a closed loop with no self-overlap
    const createClosedLoopWaypoints = (
      lon: number,
      lat: number,
      factor: number
    ): DirectionsWaypoint[] => {
      const offset = factor; // Smaller, controlled offsets to better match the target distance
      return [
        { coordinates: [lon, lat] },
        { coordinates: [lon + offset, lat] },
        { coordinates: [lon + offset, lat + offset] },
        { coordinates: [lon, lat + offset] },
        { coordinates: [lon, lat] },
      ];
    };

    // Generate more routes
    const routeRequests = [];
    for (let i = 0; i < 100; i++) {
      // Increase the number of routes generated
      const factor = 0.0005 * (i + 1); // Smaller and more controlled offsets
      const waypoints = createClosedLoopWaypoints(longitude, latitude, factor);

      console.log(`Requesting route ${i + 1} with waypoints:`, waypoints);
      routeRequests.push(
        directionsClient
          .getDirections({
            profile: mapboxProfile,
            waypoints,
            steps: true,
            geometries: "geojson",
            overview: "full",
          })
          .send()
      );
    }

    const responses = await Promise.all(routeRequests);
    console.log("Received route responses:", responses.length);

    const routes = responses
      .map((response, index) => {
        if (!response.body.routes.length) {
          console.warn(`No route found for request ${index + 1}`);
        }
        return response.body.routes[0];
      })
      .filter(Boolean);

    console.log("Generated routes:", routes.length);

    // Add distance property if it's missing
    const enrichedRoutes = routes.map((route) => {
      if (!route.distance) {
        route.distance = route.legs.reduce(
          (acc: number, leg: any) => acc + leg.distance,
          0
        );
      }
      return route;
    });

    // Sort routes by absolute proximity to the target distance
    enrichedRoutes.sort((a, b) => {
      const diffA = Math.abs(a.distance - targetDistance);
      const diffB = Math.abs(b.distance - targetDistance);
      return diffA - diffB;
    });

    // Select the top 10 routes closest to the desired distance
    const bestRoutes = enrichedRoutes.slice(0, 10);

    console.log("Best routes selected:", bestRoutes);
    res.json({ routes: bestRoutes });
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch directions", routes: [] });
  }
};
