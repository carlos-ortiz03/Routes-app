import React, { useState, useEffect } from "react";
import Form from "./MileageForm";
import RoutesList from "./RoutesList";
import MapComponent from "./Map";
import axios from "axios";
import { Place } from "../types";

const MainContent: React.FC = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [unit, setUnit] = useState<string>("kilometers");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
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

      setRoutes(response.data.routes || []);

      if (response.data.routes && response.data.routes.length > 0) {
        const geojson = {
          type: "FeatureCollection",
          features: response.data.routes.map((route: any) => ({
            type: "Feature",
            geometry: route.geometry,
            properties: {},
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
    setCenter({
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
    });
  };

  const handleSelectRoute = (route: any) => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: route.geometry,
          properties: {},
        },
      ],
    };
    setSelectedRoute(geojson);
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "kilometers" ? "miles" : "kilometers"));
  };

  return (
    <div className="flex flex-col w-3/4 p-4">
      <div className="mb-4">
        <Form onSearch={handleSearch} onSelectPlace={handleSelectPlace} />
      </div>
      <div className="mb-4">
        <button onClick={toggleUnit} className="bg-blue-500 text-white p-2">
          Toggle to {unit === "kilometers" ? "miles" : "kilometers"}
        </button>
      </div>
      <div className="mb-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Routes Generated</h2>
        <RoutesList
          routes={routes}
          onSelectRoute={handleSelectRoute}
          unit={unit}
        />
      </div>
      <div className="flex-grow">
        <MapComponent center={center} directions={selectedRoute} />
      </div>
    </div>
  );
};

export default MainContent;
