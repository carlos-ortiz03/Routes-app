import React, { useState, useEffect } from "react";
import Form from "./MileageForm";
import RoutesList from "./RoutesList";
import MapComponent from "./Map";
import axios from "axios";
import { Place } from "../types";
import { bbox } from "@turf/turf";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

const MainContent: React.FC = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);
  const [viewport, setViewport] = useState({
    lng: 0,
    lat: 0,
    zoom: 10,
  });
  const [originalLocation, setOriginalLocation] = useState<{
    lng: number;
    lat: number;
  }>({ lng: 0, lat: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport({ lat: latitude, lng: longitude, zoom: 10 });
        setOriginalLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const handleSearch = async (
    location: string,
    mileage: number,
    travelMode: string
  ) => {
    console.log("Initiating search with the following parameters:");
    console.log("Location:", location);
    console.log("Mileage:", mileage);
    console.log("Travel Mode:", travelMode);

    try {
      const response = await axios.get(
        "http://localhost:5001/api/maps/directions",
        {
          params: {
            origin: location,
            mileage: mileage,
            travelMode: travelMode,
          },
        }
      );

      console.log("Received response from backend:", response.data);

      const fetchedRoutes = response.data.routes || [];
      // Ensure travelMode is set for each route
      const routesWithTravelMode = fetchedRoutes.map((route: any) => ({
        ...route,
        travelMode: travelMode, // Directly use the provided travelMode
      }));

      setRoutes(routesWithTravelMode);

      if (routesWithTravelMode.length > 0) {
        const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
          type: "FeatureCollection",
          features: routesWithTravelMode.map((route: any) => ({
            type: "Feature",
            geometry: route.geometry,
            properties: { travelMode: travelMode, name: route.name },
          })),
        };
        setSelectedRoute(geojson);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]);
    }
  };

  const handleSelectPlace = (place: Place) => {
    const newLocation = {
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
    };
    setViewport({
      ...newLocation,
      zoom: 14,
    });
    setOriginalLocation(newLocation);
  };

  const handleSelectRoute = (route: any) => {
    if (route && route.geometry && route.geometry.coordinates) {
      const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: route.geometry,
            properties: { travelMode: route.travelMode, name: route.name },
          },
        ],
      };
      const [minLng, minLat, maxLng, maxLat] = bbox(geojson);
      const lng = (minLng + maxLng) / 2;
      const lat = (minLat + maxLat) / 2;
      const zoom = Math.max(
        14, // minimum zoom level
        Math.min(
          Math.log2(360 / (maxLng - minLng)),
          Math.log2(180 / (maxLat - minLat))
        )
      );
      setSelectedRoute(geojson);
      setViewport({ lng, lat, zoom });
    } else {
      console.error("Invalid route data:", route);
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden text-white rounded-lg space-y-4">
      <div className="mb-4">
        <Form onSearch={handleSearch} onSelectPlace={handleSelectPlace} />
      </div>
      <div className="flex flex-grow overflow-hidden space-x-4">
        <div className="w-1/3 flex flex-col overflow-hidden pr-4">
          <div className="bg-[#2B2929] p-4 rounded-lg flex-grow h-full">
            <h2 className="text-xl font-bold mb-2">Routes Generated</h2>
            <RoutesList
              routes={routes}
              onSelectRoute={handleSelectRoute}
              selectedRoute={selectedRoute}
            />
          </div>
        </div>
        <div className="w-2/3 h-full rounded-lg overflow-hidden">
          <MapComponent
            center={viewport}
            originalLocation={originalLocation}
            directions={selectedRoute}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
