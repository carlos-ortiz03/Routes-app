import React, { useState } from "react";
import Form from "./MileageForm";
import List from "./RoutesList";
import MapComponent from "./Map";
import axios from "axios";
import { Route } from "../types";
import MapProvider from "./MapProvider";

const MainContent: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const handleSearch = async (location: string, mileage: number) => {
    console.log("Initiating search with the following parameters:");
    console.log(`Location: ${location}`);
    console.log(`Mileage: ${mileage}`);

    try {
      const response = await axios.get(
        "http://localhost:5001/api/maps/directions",
        {
          params: {
            origin: location || "current location",
            destination: location || "current location",
          },
          withCredentials: true,
        }
      );

      console.log("Received response from backend:");
      console.log(response.data);

      const filteredRoutes: Route[] = response.data.routes.filter(
        (route: Route) => {
          const routeDistance =
            route.legs.reduce(
              (acc: number, leg) => acc + leg.distance.value,
              0
            ) / 1000;
          return routeDistance <= mileage;
        }
      );

      console.log("Filtered routes based on mileage:");
      console.log(filteredRoutes);

      setRoutes(filteredRoutes);

      if (filteredRoutes.length > 0) {
        setSelectedRoute(filteredRoutes[0]);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleSelectRoute = (route: Route) => {
    console.log("Selected route:");
    console.log(route);
    setSelectedRoute(route);
  };

  return (
    <MapProvider>
      <div className="flex flex-col w-3/4 p-4">
        <div className="mb-4">
          <Form onSearch={handleSearch} />
        </div>
        <div className="mb-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Routes Generated</h2>
          <List routes={routes} onSelectRoute={handleSelectRoute} />
        </div>
        <div className="flex-grow">
          <MapComponent />
        </div>
      </div>
    </MapProvider>
  );
};

export default MainContent;
