import React, { useState, useEffect } from "react";
import Form from "./MileageForm";
import List from "./RoutesList";
import MapComponent from "./Map";
import axios from "axios";

const MainContent: React.FC = () => {
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [selectedRoute, setSelectedRoute] =
    useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

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
    travelMode: google.maps.TravelMode
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
            destination: location,
            mileage: mileage,
            travelMode: travelMode,
          },
        }
      );

      console.log("Received response from backend:", response.data);

      const firstTenRoutes = response.data.routes.slice(0, 10); // Get the first ten routes

      console.log("First ten routes:", firstTenRoutes);

      setRoutes(firstTenRoutes);

      if (firstTenRoutes.length > 0) {
        const firstLeg = firstTenRoutes[0].legs?.[0];
        if (firstLeg) {
          const request: google.maps.DirectionsRequest = {
            origin: firstLeg.start_location,
            destination: firstLeg.end_location,
            travelMode: travelMode,
          };
          console.log("Directions Request:", request);
          setSelectedRoute({ routes: firstTenRoutes, request });
        }
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleSelectRoute = (route: google.maps.DirectionsRoute) => {
    const firstLeg = route.legs?.[0];
    if (firstLeg) {
      const request: google.maps.DirectionsRequest = {
        origin: firstLeg.start_location,
        destination: firstLeg.end_location,
        travelMode:
          (route as any).request.travelMode || google.maps.TravelMode.WALKING,
      };
      console.log("Selected Route Request:", request);
      setSelectedRoute({ routes: [route], request });
    }
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
        <MapComponent center={center} directions={selectedRoute} />
      </div>
    </div>
  );
};

export default MainContent;
