"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirections = void 0;
const directions_1 = __importDefault(require("@mapbox/mapbox-sdk/services/directions"));
const geocoding_1 = __importDefault(require("@mapbox/mapbox-sdk/services/geocoding"));
const directionsClient = (0, directions_1.default)({
    accessToken: process.env.MAPBOX_API_KEY,
});
const geocodingClient = (0, geocoding_1.default)({
    accessToken: process.env.MAPBOX_API_KEY,
});
const mapTravelMode = (mode) => {
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
const getDirections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origin, mileage, travelMode } = req.query;
    if (!origin || !mileage || !travelMode) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    try {
        const geocodeResponse = yield geocodingClient
            .forwardGeocode({
            query: origin,
            limit: 1,
        })
            .send();
        if (!geocodeResponse.body.features.length) {
            return res.status(400).json({ error: "Invalid origin address" });
        }
        const [longitude, latitude] = geocodeResponse.body.features[0].geometry.coordinates;
        const targetDistance = parseFloat(mileage) * 1000; // Convert km to meters
        const mapboxProfile = mapTravelMode(travelMode);
        // Function to create a closed loop with no self-overlap
        const createClosedLoopWaypoints = (lon, lat, factor) => {
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
            routeRequests.push(directionsClient
                .getDirections({
                profile: mapboxProfile,
                waypoints,
                steps: true,
                geometries: "geojson",
                overview: "full",
            })
                .send());
        }
        const responses = yield Promise.all(routeRequests);
        const routes = responses.map((response) => response.body.routes[0]);
        // Add distance property if it's missing
        const enrichedRoutes = routes.map((route) => {
            if (!route.distance) {
                route.distance = route.legs.reduce((acc, leg) => acc + leg.distance, 0);
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
        res.json({ routes: bestRoutes });
    }
    catch (error) {
        console.error("Error fetching directions:", error);
        res.status(500).json({ error: "Failed to fetch directions", routes: [] });
    }
});
exports.getDirections = getDirections;
