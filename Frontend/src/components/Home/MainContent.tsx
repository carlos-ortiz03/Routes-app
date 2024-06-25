import React, { useState } from "react";
import Form from "./MileageForm";
import List from "./RoutesList";
import MapComponent from "./Map";
import axios from "axios";

const MainContent: React.FC = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSearch = async (location: string, mileage: number) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: location || "current location",
            destination: location || "current location",
            key: apiKey,
            alternatives: true, // to get multiple routes
          },
        }
      );

      // Filter routes based on mileage
      const filteredRoutes = response.data.routes.filter((route) => {
        const routeDistance =
          route.legs.reduce(
            (acc: number, leg: any) => acc + leg.distance.value,
            0
          ) / 1000; // distance in km
        return routeDistance <= mileage;
      });

      setRoutes(filteredRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
  };

  return (
    <div className="flex flex-col w-3/4 p-4">
      <div className="mb-4">
        <Form onSearch={handleSearch} />
      </div>
      <div className="mb-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Routes Generated</h2>
        <List routes={routes} onSelectRoute={handleSelectRoute} />
      </div>
      <div className="flex-grow">
        <MapComponent directions={selectedRoute} />
      </div>
    </div>
  );
};

export default MainContent;
